import React, { useContext, useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Grid, Segment, Form, Button } from "semantic-ui-react";
import TextInput from "../../app/common/form/TextInput";
import TextAreaInput from "../../app/common/form/TextAreaInput";
import { Form as FinalForm, Field } from "react-final-form";
import { RootStoreContext } from "../../app/stores/rootStore";
import { ProfileFormValues } from "../../app/models/profile";
import { combineValidators, isRequired } from "revalidate";

const validate = combineValidators({
    displayName: isRequired({ message: 'The display name is required' }),
  });

const ProfileEditForm = () => {
  const rootStore = useContext(RootStoreContext);
  const { profile, editProfile, submitting } = rootStore.profileStore;

  const [profileForm, setProfileForm] = useState(new ProfileFormValues());

  useEffect(() => {
    setProfileForm(new ProfileFormValues());
    profileForm.displayName = profile!.displayName;
    profileForm.bio = profile!.bio;
  }, []);

  const handleFinalFormSubmit = (values: any) => {
    const { ...profileForm } = values;
    editProfile(profileForm);
  };

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing>
          <FinalForm
            validate={validate}
            initialValues={profile}
            onSubmit={handleFinalFormSubmit}
            render={({ handleSubmit, invalid, pristine }) => (
              <Form onSubmit={handleSubmit}>
                <Field
                  name="displayName"
                  placeholder="Display Name"
                  value={profileForm.displayName}
                  component={TextInput}
                />
                <Field
                  name="bio"
                  placeholder="Bio"
                  rows={3}
                  value={profileForm.bio}
                  component={TextAreaInput}
                />
                <Button
                  loading={submitting}
                  disabled={invalid || pristine}
                  floated="right"
                  positive
                  type="submit"
                  content="Submit"
                />
              </Form>
            )}
          />
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ProfileEditForm);
