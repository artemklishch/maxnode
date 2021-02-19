const fs = require("fs");
const path = require("path");
const { validationResult } = require("express-validator");
const Post = require("../models/post");
const User = require("../models/user");

exports.getPosts = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  let totalItems;
  Post.find()
    .countDocuments() // возвращает общее число данных
    .then((count) => {
      totalItems = count;
      return Post.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then((posts) => {
      if (!posts) {
        const error = new Error("Posts are not found");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({
        message: "Posts are fetched successfully",
        posts: posts,
        totalItems: totalItems,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(
      "Validation failed, some field is filled incorrectly"
    );
    error.statusCode = 422; // кастомное свойство в объекте error
    throw error; // после этого программа будет искать другую ункцию по валидации внутри
    // экспресс приложения

    // return res
    //   .status(422)
    //   .json({ message: "Validation failed", errors: errors.array() });
  }
  if (!req.file) {
    const error = new Error("Image not provided");
    error.statusCode = 422;
    throw error;
  }
  let imageUrl = req.file.path; // достаем путь к файлу из объекта file
  // здесь дынные формы собраны с помощью new FormData()
  if (imageUrl.includes("\\")) {
    imageUrl = imageUrl.split("\\").join("/");
  }
  let creator;
  const title = req.body.title;
  const content = req.body.content;
  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: req.userId, // эти данные есть, т.к. срабатывает функция из файла is-auth.js
    // и req.userId - это строка, но мангуз преобразует ее в объект, т.к. монгодб создаает айдишник в виде объекта
  });
  post
    .save()
    .then((result) => {
      return User.findById(req.userId);
    })
    .then((user) => {
      creator = user;
      user.posts.push(post); // здесь мы добавляем в массив не обек поста, а id поста, т.к.
      // в модели пользователя мы сделали ссылку на посты и обозначили тип - Schema.Types.ObjectId
      // мангус преобразует объект поста в идентификатор
      return user.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "Post created successfully!",
        creator: { _id: creator._id, name: creator.name },
        post: post,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .populate("creator")
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find post.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: "Post fetched", post: post });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updatePost = (req, res, next) => {
  const postId = req.params.postId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(
      "Validation failed, some field is filled incorrectly"
    );
    error.statusCode = 422;
    throw error;
  }
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = req.file.path;
  }
  if (!imageUrl) {
    const error = new Error("No file picked.");
    error.statusCode = 422;
    throw error;
  }
  if (imageUrl.includes("\\")) {
    imageUrl = imageUrl.split("\\").join("/");
  }
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find post.");
        error.statusCode = 404;
        throw error;
      }
      if (post.creator.toString() !== req.userId) {
        const error = new Error("Not authorized.");
        error.statusCode = 403;
        throw error;
      }
      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }
      post.title = title;
      post.content = content;
      post.imageUrl = imageUrl;
      return post.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Post updated!", post: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find post.");
        error.statusCode = 404;
        throw error;
      }
      if (post.creator.toString() !== req.userId) {
        const error = new Error("Not authorized.");
        error.statusCode = 403;
        throw error;
      }
      // checked logged in user
      clearImage(post.imageUrl);
      return Post.findByIdAndRemove(postId);
    })
    .then((result) => {
      return User.findById(req.userId);
    })
    .then((user) => {
      // user.posts = user.posts.filter((p) => p.toString() !== postId.toString());
      user.posts.pull(postId); // этот метод мангуза - pull(postId) - удаляет из массива
      // тот элемент, к-й соответствует удаленному посту
      // т.е. можно исползовать вместо фильтра, что выше
      return user.save();
    })
    .then(() => res.status(200).json({ message: "Deleted post" }))
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const clearImage = (filePath) => {
  const newPath = path.join(__dirname, "..", filePath);
  fs.unlink(newPath, (err) => console.log(err));
}; // интересно, но это работает в выше написаннном коде?
