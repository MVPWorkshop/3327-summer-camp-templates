import React from 'react';
import styles from './separator.module.scss';
import { ISeparatorProps } from './separator.types';
import { classes } from '../../../shared/utils/styles.util';

const Separator: React.FC<ISeparatorProps> = (props) => {

  const {
    vertical,
    className
  } = props;

  return(
    <div
      className={classes(
        styles.separator,
        vertical ? styles.vertical : styles.horizontal,
        className
      )}
    />
  )
};

export default  Separator;
