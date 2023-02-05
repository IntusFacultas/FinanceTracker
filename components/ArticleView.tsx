import React, { FunctionComponent } from 'react';
import Router from 'next/router';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import { Heading, Text } from './Primitives/Typography';

export type Post = {
    id: string;
    title: string;
    author: {
        name: string;
        email: string;
    } | null;
    content: string;
    published: boolean;
};

const StyledPost = styled.div`
    color: inherit;
    padding: 2rem;
    background-color: white;
`;

const ArticleView: FunctionComponent<{ post: Post }> = ({ post }) => {
    const authorName = post.author ? post.author.name : 'Unknown author';
    return (
        <StyledPost onClick={() => Router.push('/p/[id]', `/p/${post.id}`)}>
            <Heading level={2}>{post.title}</Heading>
            <Text type="finePrint">By {authorName}</Text>
            <ReactMarkdown children={post.content} />
        </StyledPost>
    );
};

export default ArticleView;
