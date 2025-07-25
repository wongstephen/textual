import React from "react";

import text from "@/locales/en.json";

import style from "./page.module.css";

const userLogin = async (formData: FormData) => {
  "use server";

  const rawFormData = {
    userName: formData.get("userName"),
    password: formData.get("password"),
    rememberMe: (formData.get("rememberMe") && true) || false,
  };

  // placeholder for actual login logic
  console.log("User login data:", rawFormData);
};

export default function Login() {
  return (
    <div className={style.loginContainer}>
      <form action={userLogin}>
        <input
          placeholder={text.login.username}
          name="userName"
          required
          className={style.input}
        ></input>
        <input
          placeholder={text.login.password}
          name="password"
          required
          className={style.input}
        ></input>
        <div className={style.checkboxContainer}>
          <input type="checkbox" name="rememberMe" /> {text.login.rememberMe}
        </div>
        <button type="submit">{text.login.submit}</button>
      </form>
    </div>
  );
}
