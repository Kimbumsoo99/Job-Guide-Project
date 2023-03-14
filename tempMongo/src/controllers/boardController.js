import Board from "../models/Board";

export const home = async (req, res) => {
  const boards = await Board.find({});
  return res.render("home", { pageTitle: "Home", boards });
};

export const view = (req, res) => res.render("board", { pageTitle: "Board" });

export const getUpload = (req, res) => {
  return res.render("create", { pageTitle: "Board" });
};

export const postUpload = async (req, res) => {
  const {
    session: { user },
    body: { title, content },
  } = req;
  try {
    await Board.create({
      writer: user,
      title,
      content,
    });

    return res.redirect("/");
  } catch (error) {
    return res.render("upload", {
      pageTitle: "Upload Video",
    });
  }
};
