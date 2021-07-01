import React from "react";
import Router from "next/router";
import ReactMarkdown from "react-markdown";
import { User } from './User';
import Link from "next/link";

export type Transaction = {
  id: number ; 
  type: string; //Retrait ou Dépot
  ticket: string;
  clearing: string; //CB ou espèces
  amount: number;
  at: Date;
};

// const Project: React.FC<{ project: ProjectProps }> = ({ project }) => {
//   return (
//       <div onClick={() => Router.push('/p/[id]', '/p/'+project.id)} className="px-2 my-5 transition duration-100 ease-linear bg-gray-200 rounded-md shadow hover:bg-gray-300 cursor-pointer">
//         <h2 className="text-xl font-medium">{project.shop}</h2>
//         <h3 className="my-3 text-lg">Utilisateurs :</h3>
//         <ul className="pl-10 mt-2 list-disc">
//           {project.users.map((user : User) => (
//             <li key={user.id}>{user.name} - {user.email}</li>
//           ))}
//         </ul>
//         <style jsx>{`
//           div {
//             color: inherit;
//             padding: 2rem;
//           }
//         `}</style>
//       </div>
//   );
// };

// export default Project;
