import prisma from 'lib/prisma'
import passwordHash from 'password-hash'

// Required fields in body: title
// Optional fields in body: content
export default async function handle(req, res) {
  const user = req.body

  const login = user.username
  const password = user.password

  const result = await prisma.user.findUnique({
    where: {
        login : login
    }
  })
  if(result && passwordHash.verify(password, result.password)){
      res.json(result)
    } else {
      res.json(false)
  }
}