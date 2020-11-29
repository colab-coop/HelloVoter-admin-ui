import React from "react";
import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import VolunteerProfile, { ProfileField } from "../VolunteerProfile.jsx";
import Button from "@material-ui/core/Button";

jest.mock("../../../common.js");
import { notify_error } from "../../../common.js";

const VOLUNTEER = {
  id: 1,
  first_name: "Foo",
  last_name: "Bar",
  email: "foo@bar.baz",
  date_of_birth: Date.parse("01-01-1970"),
  address: {
    address1: "123 Test St",
    address2: "Apt 4",
    city: "Test City",
    state: "GA",
    zip: "00000",
  },
};

const VOLUNTEER_UPDATE = {
  first_name: "Updated",
  last_name: "Volunteer",
  date_of_birth: Date.parse("01-02-1970"),
  address: {
    address1: "123 Test Rd",
    city: "Updated City",
    state: "FL",
    zip: "00001",
  },
};

const READ_ONLY_FIELDS = ["Phone", "Email"];

describe("VolunteerProfile", () => {
  it("should match snapshot", () => {
    const refer = { _updateAmbassador: jest.fn() };
    const profile = mount(
      <VolunteerProfile volunteer={VOLUNTEER} refer={refer} />
    );
    expect(toJson(profile)).toMatchSnapshot();
  });

  it("should match snapshot of editing state", () => {
    const refer = { _updateAmbassador: jest.fn() };
    const profile = mount(
      <VolunteerProfile volunteer={VOLUNTEER} refer={refer} />
    );
    profile.find(Button).simulate("click");
    expect(toJson(profile)).toMatchSnapshot();
  });

  it("switches to editing state when the edit profile button is pressed", () => {
    const refer = { _updateAmbassador: jest.fn() };
    const profile = mount(
      <VolunteerProfile volunteer={VOLUNTEER} refer={refer} />
    );
    profile.find(ProfileField).forEach((f) => {
      expect(f.prop("editing")).toBeFalsy();
      expect(f.find("input").length).toBe(0);
    });
    let buttons = profile.find(Button);
    expect(buttons.text()).toBe("Edit Profile");
    buttons.simulate("click");
    profile.find(ProfileField).forEach((f) => {
      if (!READ_ONLY_FIELDS.includes(f.prop("label"))) {
        expect(f.prop("editing")).toBeTruthy();
        expect(f.find("input").length).toBe(1);
      }
    });
    buttons = profile.find(Button);
    expect(buttons.length).toBe(2);
    expect(buttons.at(0).text()).toBe("Save");
    expect(buttons.at(1).text()).toBe("Cancel");
  });

  it("exits editing state when the cancel button is pressed", () => {
    const refer = { _updateAmbassador: jest.fn() };
    const profile = mount(
      <VolunteerProfile volunteer={VOLUNTEER} refer={refer} />
    );
    let buttons = profile.find(Button);
    buttons.simulate("click");
    buttons = profile.find(Button);
    buttons.at(1).simulate("click");
    profile.find(ProfileField).forEach((f) => {
      expect(f.prop("editing")).toBeFalsy();
      expect(f.find("input").length).toBe(0);
    });
    buttons = profile.find(Button);
    expect(buttons.text()).toBe("Edit Profile");
  });

  it("saves changes when the save button is pressed", () => {
    const refer = { _updateAmbassador: jest.fn() };
    const profile = mount(
      <VolunteerProfile volunteer={VOLUNTEER} refer={refer} />
    );
    let buttons = profile.find(Button);
    buttons.simulate("click");
    profile.find(ProfileField).forEach((f) => {
      if (!READ_ONLY_FIELDS.includes(f.prop("label"))) {
        const name = f.prop("field");
        const value = VOLUNTEER_UPDATE[name] || VOLUNTEER_UPDATE.address[name];
        f.find("input").simulate("change", { target: { name, value } });
      }
    });
    buttons = profile.find(Button);
    buttons.at(0).simulate("click");
    expect(refer._updateAmbassador.mock.calls.length).toBe(1);
    expect(refer._updateAmbassador.mock.calls[0][0]).toBe(VOLUNTEER.id);
    expect(refer._updateAmbassador.mock.calls[0][1]).toEqual(VOLUNTEER_UPDATE);
  });

  it("rejects inputs if fields other than address2 are left blank", () => {
    const refer = { _updateAmbassador: jest.fn() };
    const profile = mount(
      <VolunteerProfile volunteer={VOLUNTEER} refer={refer} />
    );
    let buttons = profile.find(Button);
    buttons.simulate("click");
    profile.find(ProfileField).forEach((f) => {
      if (!READ_ONLY_FIELDS.includes(f.prop("label"))) {
        const name = f.prop("field");
        const value = undefined;
        f.find("input").simulate("change", { target: { name, value } });
      }
    });
    buttons = profile.find(Button);
    buttons.at(0).simulate("click");
    expect(notify_error.mock.calls.length).toBe(1);
    profile.find(ProfileField).forEach((f) => {
      if (
        f.prop("field") !== "address2" &&
        !READ_ONLY_FIELDS.includes(f.prop("label"))
      ) {
        const inputStyle = f.find("input").prop("style");
        expect(inputStyle).toHaveProperty("border");
        expect(inputStyle).toHaveProperty("backgroundColor");
      }
    });
  });
});
