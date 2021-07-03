import { getCsrfToken } from 'next-auth/client'

export default function SignIn({ csrfToken }) {
    return (
      <div className="h-screen bg-gray-900 flex flex-col space-y-10 justify-center items-center">
        <div className="bg-white w-96 shadow-xl rounded p-5">
          <h1 className="text-3xl font-medium">Connexion</h1>
          <p className="text-sm">Pour accéder aux projets, identifiez-vous !</p>
          
          <form className="space-y-5 mt-5" method='post' action='/api/auth/callback/credentials'>
          <input name='csrfToken' type='hidden' defaultValue={csrfToken}/>
          <input type="text" name='username' className="w-full h-12 border border-gray-800 rounded px-3" placeholder="Login" />
          <input type="password" name='password' className="w-full h-12 border border-gray-800 rounded px-3" placeholder="Mot de passe" />


            <button className="btn text-center w-full bg-blue-900 rounded-md text-white py-3 font-medium" type='submit'>Connexion</button>
          </form>
        </div>
      </div>
    )
  }

  export async function getServerSideProps(context) {
    return {
      props: {
        csrfToken: await getCsrfToken(context)
      }
    }
  }