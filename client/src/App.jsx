import React from "react";
import { Route, Routes } from "react-router-dom";
import Signup from './Components/Auth/Signup'
import VerifyMail from './Components/Auth/VerifyMail';
import Login from "./Components/Auth/Login";
import Home from './Components/Home';
import ListerDashboard from "./Components/Dashboard/listerScreen";
import CreateProperty from "./Components/Dashboard/createProperty";
import EditProperty from "./Components/Dashboard/editproperty";
import ViewProperty from "./Components/Dashboard/viewProperty";
import ViewSProperty from "./Components/Dashboard/viewSProperty";
import TermsConditions from "./Components/Common/TermsConditions";
import PrivacyPolicy from "./Components/Common/PrivacyPolicy";
function App() {
  console.log('VITE_SERVER:', import.meta.env.VITE_SERVER);
console.log('All env vars:', import.meta.env);
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-mail" element={<VerifyMail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/listerDashboard" element={<ListerDashboard />} />
        <Route path="/createProperty" element={<CreateProperty />} />
        <Route path="/editProperty/:propertyId" element={<EditProperty />} />
        <Route path="/view-properties" element = {<ViewProperty/>} />
        <Route path="/view-s-properties/:propertyId" element = {<ViewSProperty/>} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />

      </Routes>
    </div>
  );
}

export default App;
