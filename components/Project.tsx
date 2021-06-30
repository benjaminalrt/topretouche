import React from "react";
import Router from "next/router";
import ReactMarkdown from "react-markdown";
import { User } from './User';
import Link from "next/link";
import { Transaction } from './Transaction';

export type ProjectProps = {
  id: number;
  shop: string;
  users: User[];
  transactions : Transaction[];
};

const Project: React.FC<{ project: ProjectProps }> = ({ project }) => {
  return (
      <div onClick={() => Router.push('/p/[id]', '/p/'+project.id)} className="p-8 my-5 transition duration-100 ease-linear bg-gray-200 rounded-md shadow hover:bg-gray-300 cursor-pointer">
        <h2 className="text-xl font-medium">{project.shop}</h2>
      </div>
  );
};

export default Project;
