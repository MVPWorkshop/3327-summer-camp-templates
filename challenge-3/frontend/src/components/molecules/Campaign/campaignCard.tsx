import React, { ChangeEventHandler, useState } from 'react';
import { ICampaignProps } from './campaignCard.types';
import styles from './campaignCard.module.scss';
import { classes } from '../../../shared/utils/styles.util';
import NoImage from '../../../shared/assets/no-image.png';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { FormControl, InputGroup } from 'react-bootstrap';
import SupportChildrenContract from '../../../contracts/supportChildren.contract';
import SupportChildrenAbi from '../../../abi/supportChildren.abi.json';
import { AbiItem } from 'web3-utils';
import { SUPPORT_CHILDREN_CONTRACT_ADDRESS } from '../../../shared/constants/config.constants';

const CampaignCard: React.FC<ICampaignProps> = (props) => {

  const {
    className,
    title,
    endTimestamp,
    description,
    id,
    imageUri
  } = props;

  const [ethValue, setEthValue] = useState<number>(0);
  const [isDonating, setIsDonating] = useState<boolean>(false);

  const onEthValueChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setEthValue(e.target.value as unknown as number);
  }

  const onDonateClick = async () => {
    setIsDonating(true);

    try {
      const supportChildren = new SupportChildrenContract(SupportChildrenAbi as AbiItem[], SUPPORT_CHILDREN_CONTRACT_ADDRESS);

      await supportChildren.donateETH(id, ethValue);
    } catch (e) {console.log(e)}

    setIsDonating(false)
  }

  return (
      <div
        key={id}
        className={classes(
          styles.campaignCard,
          className
        )}
      >
        <Link to={`/campaign/${id}/details`}>
          <img
            alt={"cover-img"}
            src={imageUri ? imageUri : NoImage}
            className={styles.coverImage}
          />
          <div className="p-2">
            <p>{title ? title : `Campaign ${id}`}</p>
            <p>Ends at: {moment(endTimestamp).format("DD/MMMM/YYYY")}</p>
            <p>{description ? description : 'No description'}</p>
          </div>
        </Link>

        <InputGroup>
          <InputGroup.Text id="basic-addon1">ETH (10^18)</InputGroup.Text>
          <FormControl
            placeholder="ETH (10^18)"
            aria-label="ETH (10^18)"
            aria-describedby="basic-addon1"
            value={ethValue}
            type="number"
            min={0}
            step={1}
            onChange={onEthValueChange}
          />
        </InputGroup>
        <button disabled={isDonating} onClick={onDonateClick}>
          {isDonating ? "Loading..." : "Donate ETH"}
        </button>
      </div>
  )
}

export default CampaignCard;
