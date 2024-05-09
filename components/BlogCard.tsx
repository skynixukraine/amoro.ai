import React from 'react';
import classes from './BlogCard.module.css';
import { calculateMinuteRead } from '@/utils/getMinuteRead';
import moment from 'moment';

const BlogCard: React.FC<{
  title: string;
  description: string;
  image: string;
  createdAt?: string;
  author?: string;
}> = ({ title, description, image, createdAt, author }) => {
  const descrtiptionView = (text: string, count: number) => {
    return text.substring(0, count) + (text.length > count ? '...' : '');
  };
  return (
    <div className={classes.card}>
      <div className={classes.img_content}>
        <img src={image} alt="card image" className={classes.image} />
      </div>
      <div className={classes.container_text}>
        <h4 dangerouslySetInnerHTML={{ __html: title || '' }} />
        <h5
          dangerouslySetInnerHTML={{
            __html: descrtiptionView(description, 92) || '',
          }}
        />
      </div>

      <div className={classes.blogCardFooter}>
        <img src="/icon-amoro.png" alt="logo" />
        <div>
          <strong>{author ? author : 'amoro.ai'}</strong>
          <h6>{`${moment(createdAt).format(
            'MMM DD, YYYY'
          )} · ${calculateMinuteRead(description)} min read`}</h6>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
