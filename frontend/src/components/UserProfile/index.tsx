import React, { useState } from "react";
import { FaArrowLeft, FaBookmark, FaUser } from "react-icons/fa";
import { Checkbox, TextField, Button } from "@mui/material";
const UserProfile = () => {
  const [email, setEmail] = useState("jsmith22@students.university.edu");
  const [password, setPassword] = useState("**");
  const [editEmail, setEditEmail] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  return (
    <div className="max-w-2xl mx-auto p-6 border rounded-lg shadow-lg bg-white">
// Header
      <div className="flex justify-between items-center mb-4">
        <button className="text-lg flex items-center gap-2 text-gray-700">
          <FaArrowLeft /> Back
        </button>
        <div className="flex gap-4">
          <FaBookmark className="text-gray-700 text-xl" />
          <FaUser className="text-gray-700 text-xl" />
        </div>
      </div>
      // Profile Info
      <div className="text-center mb-6">
        <div className="w-20 h-20 mx-auto bg-yellow-400 rounded-full flex items-center justify-center text-4xl">
          <FaUser />
        </div>
        <h2 className="text-xl font-semibold mt-2">John Smith</h2>
      </div>
     // Account Settings
      <div className="border p-4 rounded-lg mb-6">
        <div className="mb-4">
          <label className="block text-gray-700">Email ID</label>
          <div className="flex gap-2 items-center">
            <TextField
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!editEmail}
              size="small"
              className="w-full"
            />
            <Button variant="outlined" onClick={() => setEditEmail(!editEmail)}>
              {editEmail ? "Save" : "Edit"}
            </Button>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <div className="flex gap-2 items-center">
            <TextField
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={!editPassword}
              size="small"
              className="w-full"
            />
            <Button variant="outlined" onClick={() => setEditPassword(!editPassword)}>
              {editPassword ? "Save" : "Edit"}
            </Button>
          </div>
        </div>
      </div>
     // Map Accessibility & Lifestyle Section Side by Side
      <div className="border p-4 rounded-lg flex gap-8">
     // Accessibility Section
        <div className="w-1/2">
          <h3 className="font-semibold">Accessibility</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2"><Checkbox /> Accessible entrances ♿</div>
            <div className="flex items-center gap-2"><Checkbox /> Screen reader 🔊</div>
            <div className="flex items-center gap-2"><Checkbox /> High contrast mode 🌙</div>
          </div>
        </div>
  // Lifestyle Section
        <div className="w-1/2 border-l pl-4">
          <h3 className="font-semibold">Lifestyle</h3>
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <TextField label="Weight" size="small" className="w-20" /> lbs
            </div>
            <div className="flex items-center gap-2">
              <TextField label="Height" size="small" className="w-20" /> ft
              <TextField size="small" className="w-20 ml-2" /> in
            </div>
          </div>
          <div>
            <Checkbox /> Prioritize longer routes
          </div>
          <div>
            <Checkbox /> Show steps and calories
          </div>
        </div>
      </div>
    </div>
  );
};
export default UserProfile;