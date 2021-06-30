import prisma from 'lib/prisma'

// Required fields in body: title
// Optional fields in body: content
export default async function handle(req, res) {
  const trans = req.body

  const result = await prisma.transaction.create({
    data: trans,
  })
  res.json(result)
}