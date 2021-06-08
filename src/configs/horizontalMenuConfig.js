import React from "react"
import * as Icon from "react-feather"

const navigationConfig = [
  {
    id: "home",
    title: "Home",
    type: "item",
    icon: <Icon.Home size={20} />,
    permissions: ["admin", "editor"],
    navLink: "/",
  },
  {
    id: "users",
    title: "Users",
    type: "item",
    icon: <Icon.User size={20} />,
    permissions: ["admin", "editor"],
    navLink: "/users",
  },
  {
    id: "categories",
    title: "Categories",
    type: "item",
    icon: <Icon.User size={20} />,
    permissions: ["admin", "editor"],
    navLink: "/categories",
  },
  {
    id: "brands",
    title: "Brands",
    type: "item",
    icon: <Icon.User size={20} />,
    permissions: ["admin", "editor"],
    navLink: "/brands",
  },  
  {
    id: "items",
    title: "Items",
    type: "item",
    icon: <Icon.User size={20} />,
    permissions: ["admin", "editor"],
    navLink: "/items",
  },
  {
    id: "products",
    title: "Products",
    type: "item",
    icon: <Icon.User size={20} />,
    permissions: ["admin", "editor"],
    navLink: "/products",
  },
]

export default navigationConfig