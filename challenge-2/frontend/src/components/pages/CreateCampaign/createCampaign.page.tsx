import React, { ChangeEventHandler, useState } from 'react';
import Page from '../../organisms/Page/page';
import { FormControl, InputGroup } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { createCampaign } from '../../../redux/campaign/campaign.redux.actions';
import { RootState } from '../../../redux/redux.types';
import { createLoadingSelector } from '../../../redux/loading/loading.redux.reducer';
import { ECampaignReduxActions } from '../../../redux/campaign/campaign.redux.types';

const CreateCampaignPage: React.FC = () => {

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [beneficiaryAddress, setBeneficiaryAddress] = useState<string>('');
  const [imageFile, setImageFile] = useState<File>();
  const [endTimestamp, setEndTimestamp] = useState(moment().add(1, "day").valueOf());

  const isFormDisabled = !title || !beneficiaryAddress || !description || !endTimestamp || !imageFile;

  const dispatch = useDispatch();

  const isCreatingCampaign = useSelector<RootState, boolean>(
    state => createLoadingSelector([
      ECampaignReduxActions.CREATE_CAMPAIGN
    ])(state)
  )

  const onTitleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setTitle(e.target.value)
  }

  const onDescriptionChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setDescription(e.target.value)
  }

  const onBeneficiaryAddressChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setBeneficiaryAddress(e.target.value)
  }

  const onDateChange = (date: Date) => {
    const momentDate = moment(date);
    setEndTimestamp(momentDate.valueOf());
  }

  const onImageChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.files && e.target.files.length) {
      setImageFile(e.target.files[0]);
    } else {
      setImageFile(undefined);
    }
  }

  const createNewCampaign = async () => {
    if (title && beneficiaryAddress && description && endTimestamp && imageFile) {
      dispatch(createCampaign(
        title,
        description,
        imageFile,
        beneficiaryAddress,
        endTimestamp
      ))
    }
  }

  return (
    <Page containerEnabled={true}>
      <InputGroup className="mb-3">
        <InputGroup.Text id="basic-addon1">Campaign title</InputGroup.Text>
        <FormControl
          placeholder="Example title"
          aria-label="Example title"
          aria-describedby="basic-addon1"
          onChange={onTitleChange}
          value={title}
        />
      </InputGroup>

      <InputGroup className="mb-3">
        <InputGroup.Text>Campaign description</InputGroup.Text>
        <FormControl
          as="textarea"
          aria-label="With textarea"
          onChange={onDescriptionChange}
          value={description}
        />
      </InputGroup>

      <InputGroup className="mb-3">
        <InputGroup.Text id="basic-addon1">Beneficiary address</InputGroup.Text>
        <FormControl
          placeholder="Valid Ethereum address"
          aria-label="Valid Ethereum address"
          aria-describedby="basic-addon1"
          onChange={onBeneficiaryAddressChange}
          value={beneficiaryAddress}
        />
      </InputGroup>

      <InputGroup className="mb-3">
        <InputGroup.Text id="basic-addon1">Cover image</InputGroup.Text>
        <input
          type="file"
          accept="image/png, image/jpg"
          onChange={onImageChange}
        />
      </InputGroup>

      <InputGroup className="mb-3">
        <InputGroup.Text id="basic-addon1">End date</InputGroup.Text>
        <DatePicker
          minDate={moment().add(1, "day").toDate()}
          value={moment(endTimestamp).toDate().toDateString()}
          onChange={onDateChange}
        />
      </InputGroup>

      <button
        onClick={createNewCampaign}
        disabled={isFormDisabled || isCreatingCampaign}
      >
        {isCreatingCampaign ? "Loading..." : "Create campaign"}
      </button>
    </Page>
  )
}

export default CreateCampaignPage;
