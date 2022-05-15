import { createClient, createCurrentUserHook } from 'next-sanity'
import createImageUrlbiuld from '@sanity/image-url'

export const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'production',
  apiVersion: '2021-10-21',
  useCdn: process.env.NODE_ENV === 'production',
}

export const sanityClient = createClient(config)

export const urlFor = (source) => createImageUrlbiuld(config).image(source)

export const useCurrentUser = createCurrentUserHook(config)
