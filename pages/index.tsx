// import type { NextPage } from 'next'
import Head from 'next/head'

import { sanityClient, urlFor } from '../sanity'

import Logo from '../assets/img/logo.png'
import Header from '../components/Header'

import { Post } from '../typings'
import Link from 'next/link'

interface Props {
  posts: Post[]
}

const Home = ({ posts }: Props) => {
  console.log(posts)

  return (
    <div className="mx-auto max-w-7xl">
      <Head>
        <title>Medium Clone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="item-center border-bacl flex justify-between border-y bg-yellow-400 py-1 lg:py-0 ">
        <div className="space-y-5 px-10">
          <h1 className="max-w-xl font-serif text-6xl">
            <span className="deceration-black deceration-4 underline ">
              Medium
            </span>{' '}
            is a palce to write and connect
          </h1>
          <h2>
            It's easy and free to post your thinking on any topic and conect
            with millions of readers
          </h2>
        </div>
        <img className="md:iline-flex  h-32 lg:h-full" src={Logo.src} />
      </div>
      <div className="grid grid-cols-1 gap-3 p-2 sm:grid-cols-2 md:gap-6 md:p-6 lg:grid-cols-3">
        {posts.map((post: Post) => (
          <Link href={`/post/${post.slug.current}`} key={post._id}>
            <div className="overflow-hidded group cursor-pointer rounded-lg border">
              <img src={urlFor(post.mainImage).url()} alt={post.title} />
              <div className="flex justify-between bg-white p-5">
                <div>
                  <p className="text-lg font-bold">{post.title}</p>
                  <p className="text-xs">
                    {post.description}{' '}
                    <span className="text-black-600 font-bold">
                      by {post.author.name}
                    </span>
                  </p>
                </div>
                <img
                  className="h-12 w-12 rounded-full"
                  src={`${urlFor(post.author.image)}`}
                  alt={post.author.name}
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Home

export const getServerSideProps = async () => {
  try {
    const query = `
    *[_type=="post"]{
      _id,
    title,
    slug,
    author->{name, image},
    mainImage,
    description,
    }    
    `
    const posts = await sanityClient.fetch(query)

    return {
      props: {
        posts,
      },
    }
  } catch (error) {
    console.log(error)
  }
}
