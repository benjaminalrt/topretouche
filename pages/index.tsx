import React, {useEffect} from "react"
import { GetStaticProps } from "next"
import Layout from "components/Layout"
import Project, { ProjectProps } from "components/Project"
import prisma from 'lib/prisma'
import { signIn, signOut, useSession } from "next-auth/client";

export const getStaticProps: GetStaticProps = async () => {
  const projects = await prisma.project.findMany({
    include: { users: true },
  })
  return { props: { projects } }
}

type Props = {
  projects: ProjectProps[],
}

const Home: React.FC<Props> = ({projects}) => {
  const [session, loading] = useSession();

  return (
    <Layout>
      <div className="container p-4 mx-auto">
        {loading &&
        <>
          <h1>Chargement en cours ...</h1>
        </>}
        {!loading && session &&
        <>
          <h1 className="text-3xl font-bold	">Bienvenue {session.user.name || session.user.email} ! Choisissez une boutique</h1>
          <main>
            {projects.map((project) => {
              if(project.users.map(u => u.id).includes(parseInt(session.id))){
                return(<div key={project.id} >
                  <Project project={project} />
                </div>)
              }
            })}
          </main>
        </>
        }
        {!loading && !session &&
        <>
          <h1 className="text-3xl font-bold	">Veuillez vous connecter</h1>
          <button className="btn mt-3" onClick={() => signIn()}>Je me connecte</button>
        </>
        }
      </div>
    </Layout>
  )
}

export default Home
