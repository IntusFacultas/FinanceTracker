import { FunctionComponent } from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import ArticleView, { Post } from '../components/ArticleView';
import prisma from '../lib/prisma';
import { Heading, Paragraph } from '../components/Primitives/Typography';
import { Flexbox } from '../components/Primitives/Flexbox';
import AuthenticationGatedContent from '../components/AuthenticationGatedContent';

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const session = await getSession({ req });
    if (!session?.user) {
        res.statusCode = 403;
        return { props: { drafts: [] } };
    }

    const drafts = await prisma.post.findMany({
        where: {
            author: { email: session.user.email },
            published: false,
        },
        include: {
            author: {
                select: { name: true },
            },
        },
    });
    return {
        props: { drafts },
    };
};

type Props = {
    drafts: Post[];
};

const Drafts: FunctionComponent<Props> = props => {
    return (
        <AuthenticationGatedContent
            unauthenticated={
                <>
                    <Heading level={1}>My Drafts</Heading>
                    <Paragraph>You need to be authenticated to view this page.</Paragraph>
                </>
            }
            authenticated={
                <>
                    <Heading level={1}>My Drafts</Heading>
                    <Flexbox gap="sm" direction="column">
                        {props.drafts.map(post => (
                            <ArticleView post={post} key={post.id} />
                        ))}
                    </Flexbox>
                </>
            }
        />
    );
};

export default Drafts;
