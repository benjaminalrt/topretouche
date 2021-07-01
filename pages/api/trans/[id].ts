import prisma from 'lib/prisma'

// DELETE /api/trans/:id
export default async function handle(req, res) {
  const transId = req.query.id

  if (req.method === 'DELETE') {
    const trans = await prisma.transaction.delete({
      where: { id: Number(transId) },
    });
    res.json(trans);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`,
    );
  }
}