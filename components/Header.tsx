import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signIn, signOut, useSession } from "next-auth/client";

const Header: React.FC = () => {
  const router = useRouter();
  const [session, loading] = useSession();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;



  let left = (
    <div>
      <Link href="/">
        <a className="text-white" data-active={isActive("/")}>
          Accueil
        </a>
      </Link>
    </div>
  );
  let right = (
    <>
      {session && 
      <div className="flex space-x-10 items-center">
        <p className="text-white">Connecté en tant que {session.user.name}</p>
        <button className="btn-small" onClick={() => signOut()}>Se déconnecter</button>
      </div>
      }
      {!session && 
      <div>
        <button className="btn-small" onClick={() => signIn()}>Se connecter</button>
      </div>
      }
    </>
  );

  return (
    <nav className="bg-gray-900 shadow-lg mb-5 p-8 flex items-center justify-between ">
      {left}
      {right}
    </nav>
  );
};

export default Header;
