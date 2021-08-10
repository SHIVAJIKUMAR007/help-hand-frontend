import React from "react";
import { NavLink } from "react-router-dom";
function Term() {
  return (
    <div>
      <div className="container">
        <h1 className="my-5">Terms And Conditions</h1>

        <ul>
          <li className="my-3">
            This is a place to helping others and find help for others.
          </li>
          <li className="my-3">
            Here no bully and Harrasment will be tollerated. This type of action
            may results suspend your account.
          </li>
          <li className="my-3">
            You can not help other by giving other money, you have to help
            others by essential commodity.
          </li>
          <li className="my-3">
            Help Hand not support any type of toxic and addictive drug. These
            type of item can not added here and if you try it may lead
            suspention of your account.{" "}
            <NavLink to="/prohibited">
              See list of all prohibited items.
            </NavLink>
          </li>
          <li className="my-3">
            Certain content, products and services available via our Service may
            include materials from third-parties.
            <br /> Third-party links on this site may direct you to third-party
            websites that are not affiliated with us. We are not responsible for
            examining or evaluating the content or accuracy and we do not
            warrant and will not have any liability or responsibility for any
            third-party materials or websites, or for any other materials,
            products, or services of third-parties.
            <br /> We are not liable for any harm or damages related to the
            purchase or use of goods, services, resources, content, or any other
            transactions made in connection with any third-party websites.
          </li>
          <li className="my-3">
            You can review the most current version of the Terms of Service at
            any time on this page. We reserve the right, at our sole discretion,
            to update, change or replace any part of these Terms of Service by
            posting updates and changes on to our website.
            <br /> It is your responsibility to check our website periodically
            for changes. Your continued use of or access to our website or the
            Service following the posting of any changes to these Terms of
            Service constitutes acceptance of those changes.
          </li>
          <li className="my-3">
            Questions about the Terms of Service should be sent to us at{" "}
            <a href="mailto:support@helphand.com">support@helphand.com</a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Term;
