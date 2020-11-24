import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/free-solid-svg-icons";

import GooglePlacesAutocomplete from "react-places-autocomplete";
import { NotificationManager } from "react-notifications";
import formatNumber from "simple-format-number";
import prettyMs from "pretty-ms";
import QRCode from "qrcode";

import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";

export function jobRuntime(start, end) {
  if (end) return prettyMs(end - start);
  return "";
}

export function jobNumber(num) {
  if (num) return formatNumber(num, { fractionDigits: 0 });
  return "";
}

export function tsToStr(ts) {
  return new Date(ts).toString();
}

export function notify_success(msg) {
  NotificationManager.success(msg, "Success", 3000);
}

export function notify_error(e, msg) {
  NotificationManager.error(msg, "Error", 6000);
  console.warn(e);
}

export async function _fetch(global, uri, method, body) {
  if (!global || !global.state) return;

  const { server, token } = global.state;

  let https = true;
  if (server.match(/:8080$/)) https = false;

  if (!method) method = "GET";

  const res = await fetch(
    `http${https ? "s" : ""}://${server}/HelloVoterHQ${
      global.state.orgId ? `/${global.state.orgId}` : ""
    }/api/v1${uri}`,
    {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : null,
    }
  );

  if (res.status >= 400) throw new Error(await res.text());

  if (res.status === 204) return {};

  return res.json();
}

export function _browserLocation(props) {
  if (!props.isGeolocationAvailable || !props.isGeolocationEnabled)
    return { access: false };
  if (props.coords) {
    return {
      access: true,
      lng: props.coords.longitude,
      lat: props.coords.latitude,
    };
  }
  return { access: true };
}

export const Icon = (props) => (
  <FontAwesomeIcon
    style={{ width: 25 }}
    data-tip={props["data-tip"] ? props["data-tip"] : props.icon.iconName}
    {...props}
  />
);

export const RootLoader = (props) => {
  if (props.flag) return <CircularProgress />;
  return (
    <div>
      <Icon
        icon={faSync}
        color="green"
        onClick={props.func}
        data-tip="Reload Data"
      />
      <div>{props.children}</div>
    </div>
  );
};

export const DialogSaving = (props) => {
  if (props.flag) {
    return (
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open
      >
        <div
          style={{
            position: "absolute",
            top: 100,
            left: "40%",
            right: "40%",
            backgroundColor: "white",
            padding: 40,
          }}
        >
          <center>
            Saving changes...
            <br />
            <br />
            <CircularProgress disableShrink />
          </center>
        </div>
      </Modal>
    );
  }
  return <div />;
};

export function _searchStringify(obj) {
  // deep copy and remove volitile variables
  const o = JSON.parse(JSON.stringify(obj));
  delete o.last_seen;
  delete o.created;
  delete o.id;
  return JSON.stringify(o).toLowerCase();
}

export async function _loadImports(global) {
  let imports = [];
  try {
    const data = await _fetch(global, "/import/list");
    imports = data && data.data ? data.data : [];
  } catch (e) {
    notify_error(e, "Unable to load import info.");
  }
  return imports;
}

export function _inviteLink(inviteCode, server, orgId) {
  return `http${server.match(/:8080$/) ? "" : "s"}://${server}/HelloVoterHQ/${
    orgId ? `${orgId}/` : ""
  }mobile/invite?inviteCode=${inviteCode}&${
    orgId ? `orgId=${orgId}` : `server=${server}`
  }`;
}

export async function _loadQRCode(global, id) {
  let qrcode = {};
  try {
    qrcode = await _fetch(global, `/qrcode/get?id=${id}`);
    qrcode.img = await QRCode.toDataURL(
      _inviteLink(id, global.state.server, global.state.orgId)
    );
  } catch (e) {
    notify_error(e, "Unable to load QRCode info.");
  }
  return qrcode;
}

export async function _loadQRCodes(global, id) {
  let qrcodes = [];

  try {
    qrcodes = await _fetch(global, "/qrcode/list");
  } catch (e) {
    notify_error(e, "Unable to load QRCode data.");
  }

  return qrcodes;
}

export async function _loadTripler(global, id) {
  let tripler = {};
  try {
    tripler = await _fetch(global, `/triplers/${id}`);
  } catch (e) {
    notify_error(e, "Unable to load tripler info.");
  }
  if (!tripler.ass) tripler.ass = { forms: [], turfs: [] };
  return tripler;
}

export async function _loadVolunteer(global, id) {
  let volunteer = {};
  try {
    volunteer = await _fetch(global, `/ambassadors/${id}`);
  } catch (e) {
    notify_error(e, "Unable to load volunteer info.");
  }
  if (!volunteer.ass) volunteer.ass = { forms: [], turfs: [] };
  return volunteer;
}

export async function _loadVolunteers(global, byType, id) {
  let volunteers = [];

  try {
    const call = "ambassadors";

    volunteers = await _fetch(global, `/${call}`);
  } catch (e) {
    notify_error(e, "Unable to load volunteer data.");
  }

  return volunteers;
}

export async function _loadTriplers(global, firstName, lastName) {
  let triplers = [];

  try {
    const call = "triplers";

    triplers = await _fetch(
      global,
      `/${call}?firstName=${firstName}&lastName=${lastName}`
    );
  } catch (e) {
    notify_error(e, "Unable to load triplers data.");
  }

  return triplers;
}

export async function _loadTurf(global, id) {
  const turf = {};

  /*
  try {
    turf = await _fetch(
      global,
      '/turf/get?turfId=' + id
    );
  } catch (e) {
    notify_error(e, 'Unable to load turf data.');
  }
  */

  return turf;
}

export async function _loadTurfs(global, flag) {
  const turf = [];

  /*
  try {
    let call = 'turf/list' + (flag ? '?geometry=true' : '');
    let data = await _fetch(global, '/' + call);
    turf = data.data ? data.data : [];
  } catch (e) {
    notify_error(e, 'Unable to load turf data.');
  }
  */

  return turf;
}

export async function _loadNearbyTurfs(global, lng, lat, dist) {
  const turf = [];

  /*
  try {
    let data = await _fetch(global, '/turf/list/byposition?longitude='+lng+'&latitude='+lat+(dist?'&dist='+dist:''));
    turf = data.data ? data.data : [];
  } catch (e) {
    notify_error(e, 'Unable to load turf data.');
  }
  */

  return turf;
}

export async function _loadForm(global, id) {
  let form = {};

  try {
    form = await _fetch(global, `/form/get?formId=${id}`);
  } catch (e) {
    notify_error(e, "Unable to load form data.");
  }

  return form;
}

export async function _loadForms(global) {
  const forms = [];

  /*
  try {
    let uri = 'form/list';

    forms = await _fetch(global, '/' + uri);
  } catch (e) {
    notify_error(e, 'Unable to load form data.');
  }
  */

  return forms;
}

export async function _loadAttribute(global, id) {
  let attribute = {};

  try {
    const data = await _fetch(global, `/attribute/get?id=${id}`);
    if (data.data) attribute = data.data[0];
  } catch (e) {
    notify_error(e, "Unable to load attribute data.");
  }

  return attribute;
}

export async function _loadAttributes(global) {
  let attributes = [];

  try {
    const data = await _fetch(global, "/attribute/list");
    attributes = data.data ? data.data : [];
  } catch (e) {
    notify_error(e, "Unable to load attribute data.");
  }

  attributes.forEach((a) => {
    if (!a.label) a.label = a.name;
  });

  return attributes;
}

export async function _loadAddressData(global, lng, lat, formId) {
  let data = [];
  try {
    data = await _fetch(
      global,
      `/address/get/byposition?limit=1000&longitude=${lng}&latitude=${lat}${
        formId ? `&formId=${formId}` : ""
      }`
    );
  } catch (e) {
    notify_error(e, "Unable to load address information.");
  }
  return data;
}

export async function _loadPeopleAddressData(global, aId, formId) {
  let data = [];
  try {
    data = await _fetch(
      global,
      `/people/get/byaddress?aId=${aId}${formId ? `&formId=${formId}` : ""}`
    );
  } catch (e) {
    notify_error(e, "Unable to load address information.");
  }
  return data;
}

export function _handleSelectChange(oldopt, newopt) {
  const add = [];
  const rm = [];

  if (!oldopt) oldopt = [];
  if (!newopt) newopt = [];

  const prior = oldopt.map((e) => e.id);

  const now = newopt.map((e) => e.id);

  // anything in "now" that isn't in "prior" gets added
  now.forEach((n) => {
    if (prior.indexOf(n) === -1) add.push(n);
  });

  // anything in "prior" that isn't in "now" gets removed
  prior.forEach((p) => {
    if (now.indexOf(p) === -1) rm.push(p);
  });

  return { add, rm };
}

export const PlacesAutocomplete = (props) => (
  <GooglePlacesAutocomplete {...props}>
    {addressSearch}
  </GooglePlacesAutocomplete>
);

const addressSearch = ({
  getInputProps,
  getSuggestionItemProps,
  suggestions,
  loading,
}) => (
  <div className="autocomplete-root">
    <input {...getInputProps()} />
    <div className="autocomplete-dropdown-container">
      {loading && <div>Loading...</div>}
      {suggestions.map((suggestion) => (
        <div {...getSuggestionItemProps(suggestion)}>
          <span>{suggestion.description}</span>
        </div>
      ))}
    </div>
  </div>
);

export const InviteSomeone = (props) => (
  <div>
    <Button
      onClick={() => props.refer.setState({ ModalInvite: true })}
      color="primary"
    >
      Invite Someone
    </Button>
    <Modal
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={!!props.refer.state.ModalInvite}
      onClose={() => props.refer.setState({ ModalInvite: false })}
    >
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 200,
          right: 200,
          backgroundColor: "white",
          padding: 40,
        }}
      >
        To invite someone, have them use the HelloVoter mobile app to scan a QR
        Code (created in the "QR Codes" menu) and they will recieve the same
        assignments that QR Code has.
      </div>
    </Modal>
  </div>
);

// transform a geojson file into an array of polygons

export var asyncForEach = async function (a, c) {
  for (let i = 0; i < a.length; i++) await c(a[i], i, a);
};

export var deepCopy = function (o) {
  return JSON.parse(JSON.stringify(o));
};

export var sleep = (m) => new Promise((r) => setTimeout(r, m));

export var ucFirst = function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export var geojson2polygons = function () {};
