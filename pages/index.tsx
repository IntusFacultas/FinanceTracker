import React, { FunctionComponent } from 'react';
import { GetStaticProps } from 'next';
import ArticleView, { Post } from '../components/ArticleView';
import prisma from '../lib/prisma';
import { Heading } from '../components/Primitives/Typography';
import { Flexbox } from '../components/Primitives/Flexbox';

export const getStaticProps: GetStaticProps = async () => {
    const feed = await prisma.post.findMany({
        where: { published: true },
        include: {
            author: {
                select: { name: true },
            },
        },
    });
    return {
        props: { feed },
        revalidate: 10,
    };
};

type BlogProps = {
    feed: Post[];
};

const Blog: FunctionComponent<BlogProps> = ({ feed }) => {
    return (
        <>
            <Heading level={1}>Public Feed</Heading>
            <Flexbox direction="column" gap="sm">
                {feed.map(post => (
                    <ArticleView post={post} key={post.id} />
                ))}
            </Flexbox>
        </>
    );
};

export default Blog;
