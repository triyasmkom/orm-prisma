import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

// Query Prisma Client
async function main(){
    await prisma.user.create({
        data: {
            name:'Alisce',
            email: `alice${Math.floor(Date.now() / 1000)}@example.com`,
            posts:{
                create:{
                    title:'Hello world'
                },
            },
            profile:{
                create: {
                    bio:'I like turtles'
                },
            },
        },

    })

    const post = await prisma.post.update({
        where: { id: 1 },
        data: { published: true },
    })
    console.log(post)

    const allUsers = await prisma.user.findMany()
    console.log("Get All Users: ", allUsers)

    const allUsersInclude = await prisma.user.findMany({
        include:{
            posts: true,
            profile: true
        }
    })
    console.log("Get All Users Include post and profile: ", allUsersInclude)


}

main().then(async ()=>{
    // tutup koneksi saat skrip berakhir
    await prisma.$disconnect()
}).catch(async (e)=>{
    console.error(e)
    // tutup koneksi saat skrip berakhir
    await prisma.$disconnect()
    process.exit()
})

