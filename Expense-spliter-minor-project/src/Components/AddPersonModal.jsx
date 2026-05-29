import React from "react";

export default function AddPersonModal({ open, onClose, onAdd }) {
  const [name, setName] = React.useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-80 shadow-xl">

        <h2 className="text-xl font-semibold mb-4">Add Person</h2>

        <input
          type="text"
          placeholder="Enter name"
          className="w-full border rounded-md px-3 py-2 mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-3 py-2 border rounded-md"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              onAdd(name);
              setName("");
              onClose();
            }}
            className="px-3 py-2 bg-blue-600 text-white rounded-md"
          >
            Add
          </button>
        </div>

      </div>
    </div>
  );
}