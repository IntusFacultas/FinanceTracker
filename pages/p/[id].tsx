import { FunctionComponent } from 'react';
import { GetServerSideProps } from 'next';
import ReactMarkdown from 'react-markdown';
import Router from 'next/router';
import { Post } from '../../components/ArticleView';
import { useSession } from 'next-auth/react';
import prisma from '../../lib/prisma';
import { Heading, Paragraph } from '../../components/Primitives/Typography';
import Button from '../../components/Primitives/Button';
import AuthenticationGatedContent from '../../components/AuthenticationGatedContent';
import { Flexbox } from '../../components/Primitives/Flexbox';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const post = await prisma.post.findUnique({
        where: {
            id: String(params?.id),
        },
        include: {
            author: {
                select: { name: true, email: true },
            },
        },
    });
    return {
        props: {
            post,
        },
    };
};

async function publishPost(id: string): Promise<void> {
    await fetch(`/api/publish/${id}`, {
        method: 'PUT',
    });
    await Router.push('/');
}

async function deletePost(id: string): Promise<void> {
    await fetch(`/api/post/${id}`, {
        method: 'DELETE',
    });
    Router.push('/');
}

const PostDetail: FunctionComponent<{ post: Post }> = ({ post }) => {
    const { data: session } = useSession();
    const userHasValidSession = Boolean(session);
    const postBelongsToUser = session?.user?.email === post.author?.email;
    const title = !post.published ? `${post.title} (Draft)` : post.title;

    return (
        <AuthenticationGatedContent
            unauthenticated={<Paragraph>Authenticating...</Paragraph>}
            authenticated={
                <>
                    <Heading level={2}>{title}</Heading>
                    <Paragraph>By {post?.author?.name || 'Unknown author'}</Paragraph>
                    <ReactMarkdown children={post.content} />
                    <Flexbox gap="sm">
                        {!post.published && userHasValidSession && postBelongsToUser && (
                            <Button variant="default" onClick={() => publishPost(post.id)}>
                                Publish
                            </Button>
                        )}
                        {userHasValidSession && postBelongsToUser && (
                            <Button variant="default" onClick={() => deletePost(post.id)}>
                                Delete
                            </Button>
                        )}
                    </Flexbox>
                </>
            }
        />
    );
};

export default PostDetail;
