import React from "react";
import Router from "next/router";
import ReactMarkdown from "react-markdown";

export type User = {
  id: number;
  name: string;
  email: string;
};