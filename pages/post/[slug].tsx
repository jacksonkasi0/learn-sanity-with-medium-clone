import React, { useState } from 'react'
import { GetServerSideProps } from 'next'

import PortableText from 'react-portable-text'
import { useForm, SubmitHandler, UseFormProps } from 'react-hook-form'

import { sanityClient, urlFor } from '../../sanity'
import Header from '../../components/Header'
import { Post, Comment } from '../../typings'

interface Props {
  post: Post
}

interface IFormInput extends UseFormProps {
  _id: string
  name: string
  email: string
  comment: string
}

const Post = ({ post }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>()
  
  const [submitted, setSubmitted] = useState<boolean>(false)

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    fetch('/api/createComment', {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then((responce) => {
        console.log(responce)
        setSubmitted(true)
      })
      .catch((error) => {
        console.log(error)
        setSubmitted(false)
      })
  }

  return (
    <main>
      <Header />
      <img
        className="h-40 w-full object-cover"
        src={urlFor(post.mainImage).url()}
        alt=""
      />
      <article className="mx-auto max-w-3xl p-5">
        <h1 className="mt-10 mb-3 text-3xl">{post.title}</h1>
        <h2 className="mb-2 text-xl font-light text-gray-500">
          {post.description}
        </h2>
        <div className="mt-5 flex items-center space-x-2">
          <img
            className="h-10 w-10 rounded-full"
            src={urlFor(post.author.image).url()}
            alt=""
          />
        </div>
        <p className="text-sm font-extralight">
          Blog post by{' '}
          <span className="text-green-600">{post.author.name}</span> - published
          at {new Date(post._createdAt).toLocaleString()}
        </p>
        <div className="mt-10">
          <PortableText
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
            content={post.body}
            serializers={{
              h1: (props: any) => (
                <h1 className="my-5 text-2xl font-bold" {...props} />
              ),
              h2: (props: any) => (
                <h2 className="my-5 text-xl font-bold" {...props} />
              ),
              p: (props: any) => <li className="my-5" {...props} />,
              li: ({ children }: any) => (
                <li className="ml-4 list-disc">{children}</li>
              ),
              link: ({ children, href }: any) => (
                <a
                  href={href}
                  target="_blank"
                  className="text-blue-500 hover:underline"
                >
                  {children}
                </a>
              ),
            }}
          />
        </div>
      </article>

      <hr className="my-5 mx-auto max-w-lg border border-yellow-500" />

      {submitted ? (
        <div className="mx-auto my-10 flex max-w-2xl flex-col rounded bg-yellow-500 p-10 text-center text-white">
          <h3 className="text-3xl font-bold">Thank you for your comment</h3>
          <p>Once it has been approved, it will appear here!</p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto mb-10  flex max-w-2xl flex-col p-5"
        >
          <h3 className="text-sm text-yellow-500">Enjoyed this article?</h3>
          <h4 className="text-3xl font-bold">Leave a comment below!</h4>
          <hr className="mt-2 py-3" />

          <input type="hidden" {...register('_id')} value={post._id} />

          <label className="mb-5 block">
            <span className="text-gray-700">Name</span>
            <input
              type="text"
              {...register('name', { required: true })}
              placeholder="Enter your name"
              className="borde form-input mt-1 block w-full rounded py-2 px-3 shadow outline-none ring-yellow-500 focus:ring"
            />
          </label>
          <label className="mb-5 block">
            <span className="text-gray-700">Email</span>
            <input
              type="email"
              {...register('email', { required: true })}
              placeholder="Enter your email address"
              className="borde form-input mt-1 block w-full rounded py-2 px-3 shadow outline-none ring-yellow-500 focus:ring"
            />
          </label>
          <label className="mb-5 block">
            <span className="text-gray-700">Comment</span>
            <textarea
              rows={8}
              {...register('comment', { required: true })}
              placeholder="Enter your commets"
              className="borde form-input mt-1 block w-full rounded py-2 px-3 shadow outline-none ring-yellow-500 focus:ring"
            />
          </label>
          <div className="flex flex-col p-5">
            {errors.name && (
              <span className="text-red-500">Name is required</span>
            )}
            {errors.email && (
              <span className="text-red-500">Emial is required</span>
            )}
            {errors.comment && (
              <span className="text-red-500">Comment is required</span>
            )}
          </div>
          <input
            type="submit"
            className="focus:shadow-outline cursor-pointer rounded-sm bg-yellow-300 py-2 px-4 font-bold text-white hover:bg-yellow-400 focus:outline-none"
          />
        </form>
      )}
      <div className="my-10 mx-auto flex max-w-2xl flex-col space-y-2 p-10 shadow shadow-yellow-500">
        <h3 className="tetx-4xl">Comments</h3>
        <hr className="pb-2" />
        {post.comments.map((comment: Comment) => (
          <div key={comment._id}>
            <p>
              <span className="text-yellow-500 ">{comment.name}: </span>
              {comment.comment}
            </p>
          </div>
        ))}
      </div>
    </main>
  )
}

export default Post

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const query = `
	*[_type=="post" && slug.current==$slug][0]{
    _id,
    _createdAt,
    title,
    slug,
    author->{name, image},
  'comments':*[_type=="comment" && post._ref == ^._id && approved==true
  ],
  mainImage,
  description,  
  body
  }
	`
  const post = await sanityClient.fetch(query, { slug: params?.slug })

  if (!post) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      post,
    },
  }
}
