import React  from 'react';
import { Container } from 'react-bootstrap';
import { IPageProps } from './page.types';
import { classes } from '../../../shared/utils/styles.util';
import styles from './page.module.scss';

const Page: React.FC<IPageProps> = (props) => {

  const {
    containerEnabled,
    children,
    ...otherProps
  } = props;

  if (containerEnabled) {
    return (
        <Container
          {...otherProps}
          className={classes(props.className, styles.page)}
        >
          <div className={styles.container}>
            {children}
          </div>
        </Container>
    )
  }

  return (
    <Container
      {...props}
      className={classes(props.className, styles.page)}
    >
      {children}
    </Container>
  )
};

export default Page;
