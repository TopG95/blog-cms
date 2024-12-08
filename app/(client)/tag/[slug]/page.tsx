import Header from '@/app/components/Header'
import PostComponent from '@/app/components/PostComponent';
import { Post } from '@/app/utils/interface';
import { client } from '@/sanity/lib/client';
import React from 'react'

async function getPostsByTag(tag: string) {
    const query = `
    *[_type == "" && references(*[_type == "tag" && slug.current == "${tag}"]._id)]{
        title,
        slug,
        publishedAt,
        excerpt,
        tags[]-> {
        _id,
        slug,
        name
    }
  }
    `;
 
    const post = await client.fetch(query);
    return post
}

export const revalidate = 60;

interface Params {
    params: {
      slug: string;
    };
};

const page = async ({params}: Params) => {
    const posts: Array<Post> = await getPostsByTag(params.slug);
  return (
    <div>
        <Header title={`#${params?.slug}`} tags/>
        <div>
            {posts?.length > 0 && posts?.map((post) => (
                <PostComponent key={post?._id} post={post} />
            ))}
        </div>
    </div>
  )
}

export default page