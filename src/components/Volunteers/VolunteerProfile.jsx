import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import { notify_error } from "../../common.js";

const VALIDATION_ERROR_MESSAGE = "All fields are required.";

const _style = {
  profile: {
    width: "30%",
  },
  field: {
    width: "100%",
  },
  invalidField: {
    width: "100%",
    border: "1px solid red",
    backgroundColor: "rgba(255, 0, 0, 0.2)",
  },
};

export const ProfileField = ({
  editing,
  type,
  label,
  field,
  value,
  onChange,
  invalidFields,
}) =>
  editing ? (
    <div>
      {label}:{" "}
      <input
        style={invalidFields[field] ? _style.invalidField : _style.field}
        name={field}
        type={type}
        onChange={onChange}
        value={value || ""}
      />
    </div>
  ) : (
    <div>
      {label}: {value}
    </div>
  );

const extractFormData = (volunteer) => ({
  first_name: volunteer.first_name,
  last_name: volunteer.last_name,
  date_of_birth: volunteer.date_of_birth,
  address: volunteer.address
    ? {
        address1: volunteer.address.address1,
        address2: volunteer.address.address2,
        city: volunteer.address.city,
        state: volunteer.address.state,
        zip: volunteer.address.zip,
      }
    : volunteer.address,
});

export default ({ volunteer, refer }) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(extractFormData(volunteer));
  const [invalidFields, setInvalidFields] = useState({});

  const setVolunteerField = (evt) =>
    setFormData({
      ...formData,
      [evt.target.name]: evt.target.value,
    });

  const setAddressField = (evt) =>
    setFormData({
      ...formData,
      address: {
        ...formData.address,
        [evt.target.name]: evt.target.value,
      },
    });

  const save = async () => {
    // validate that all fields are filled (except address line 2)
    const blankFields = {};
    Object.keys(formData).forEach((k) => {
      if (!formData[k]) {
        blankFields[k] = true;
      }
    });
    Object.keys(formData.address).forEach((k) => {
      if (k != "address2" && !formData.address[k]) {
        blankFields[k] = true;
      }
    });
    if (Object.keys(blankFields).length > 0) {
      setInvalidFields(blankFields);
      notify_error(
        new Error(VALIDATION_ERROR_MESSAGE),
        VALIDATION_ERROR_MESSAGE
      );
      return;
    }
    refer._updateAmbassador(volunteer.id, formData);
  };

  const cancel = () => {
    setFormData(extractFormData(volunteer));
    setInvalidFields({});
    setEditing(false);
  };

  const addressData = formData.address || {};

  return (
    <div style={_style.profile}>
      <ProfileField
        editing={editing}
        label="First Name"
        type="text"
        field="first_name"
        value={formData.first_name}
        onChange={setVolunteerField}
        invalidFields={invalidFields}
      />
      <ProfileField
        editing={editing}
        label="Last Name"
        type="text"
        field="last_name"
        value={formData.last_name}
        onChange={setVolunteerField}
        invalidFields={invalidFields}
      />
      <ProfileField
        editing={editing}
        label="Address Line 1"
        type="text"
        field="address1"
        value={addressData.address1}
        onChange={setAddressField}
        invalidFields={invalidFields}
      />
      <ProfileField
        editing={editing}
        label="Address Line 2"
        type="text"
        field="address2"
        value={addressData.address2}
        onChange={setAddressField}
        invalidFields={invalidFields}
      />
      <ProfileField
        editing={editing}
        label="City"
        type="text"
        field="city"
        value={addressData.city}
        onChange={setAddressField}
        invalidFields={invalidFields}
      />
      <ProfileField
        editing={editing}
        label="State"
        type="text"
        field="state"
        value={addressData.state}
        onChange={setAddressField}
        invalidFields={invalidFields}
      />
      <ProfileField
        editing={editing}
        label="Zip"
        type="number"
        field="zip"
        value={addressData.zip}
        onChange={setAddressField}
        invalidFields={invalidFields}
      />
      <ProfileField editing={false} label="Phone" value={volunteer.phone} />
      <ProfileField editing={false} label="Email" value={volunteer.email} />
      <ProfileField
        editing={editing}
        label="Date of Birth"
        type="date"
        field="date_of_birth"
        value={formData.date_of_birth}
        onChange={setVolunteerField}
        invalidFields={invalidFields}
      />
      {editing ? (
        <div>
          <Button onClick={save}>Save</Button>
          <Button onClick={cancel}>Cancel</Button>
        </div>
      ) : (
        <div>
          <Button onClick={() => setEditing(true)}>Edit Profile</Button>
        </div>
      )}
    </div>
  );
};
