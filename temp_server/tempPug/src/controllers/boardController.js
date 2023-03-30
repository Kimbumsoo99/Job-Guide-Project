export const home = (req, res) => {
  const boards = [
    {
      title: "첫번째 게시글",
      comments: 2,
      createdAt: "2 minutes ago",
      views: 59,
      id: 1,
    },
    {
      title: "두번째 게시글",
      comments: 2,
      createdAt: "2 minutes ago",
      views: 59,
      id: 1,
    },
    {
      title: "세번째 게시글",
      comments: 2,
      createdAt: "2 minutes ago",
      views: 59,
      id: 1,
    },
  ];

  return res.render("home", { pageTitle: "Home", boards });
};

export const view = (req, res) => res.render("board", { pageTitle: "Board" });
