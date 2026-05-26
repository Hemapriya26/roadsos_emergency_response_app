import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import useAppStore from '../store/appStore';

const EmergencyContacts = () => {
  const navigate = useNavigate();
  const { contacts, removeContact, addContact, updateContact, sosTemplate, setSosTemplate } = useAppStore();
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  
  const [isEditingTemplate, setIsEditingTemplate] = useState(false);
  const [tempTemplate, setTempTemplate] = useState('');

  const resetForm = () => {
    setFormName('');
    setFormPhone('');
    setErrorMsg('');
    setIsAdding(false);
    setEditingId(null);
  };

  const validateAndSubmit = (e) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim()) {
      setErrorMsg('Name and phone number are required.');
      return;
    }
    const phoneRegex = /^[+]?[\d\s-]{7,15}$/;
    if (!phoneRegex.test(formPhone)) {
      setErrorMsg('Please enter a valid phone number.');
      return;
    }

    if (editingId) {
      // Update existing contact
      const existing = contacts.find(c => c.id === editingId);
      updateContact({
        ...existing,
        name: formName.trim(),
        phone: formPhone.trim(),
        initial: formName.trim().charAt(0).toUpperCase(),
      });
    } else {
      // Add new contact
      const newContact = {
        id: Date.now().toString(),
        name: formName.trim(),
        phone: formPhone.trim(),
        initial: formName.trim().charAt(0).toUpperCase(),
        color: 'bg-primary-container text-on-primary-container'
      };
      addContact(newContact);
    }
    resetForm();
  };

  const startEdit = (contact) => {
    setEditingId(contact.id);
    setFormName(contact.name);
    setFormPhone(contact.phone);
    setErrorMsg('');
    setIsAdding(false);
  };

  const startAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormName('');
    setFormPhone('');
    setErrorMsg('');
  };

  const handleDelete = (id) => {
    removeContact(id);
    setDeleteConfirmId(null);
    if (editingId === id) resetForm();
  };

  const handleNotifyAll = () => {
    navigate('/sos');
  };

  // Shared form component for add/edit
  const ContactForm = ({ isEdit }) => (
    <form onSubmit={validateAndSubmit} className="bg-surface-container-low border border-primary/30 rounded-xl p-4 shadow-sm flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-label-lg text-label-xl text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-lg">{isEdit ? 'edit' : 'person_add'}</span>
          {isEdit ? 'Edit Contact' : 'Add New Contact'}
        </h3>
      </div>
      {errorMsg && <p className="text-error font-body-sm text-[12px] bg-error-container/30 px-3 py-1.5 rounded-lg">{errorMsg}</p>}
      
      <div className="flex flex-col gap-1">
        <label className="font-label-sm text-[12px] text-on-surface-variant">Name</label>
        <input 
          type="text" 
          value={formName} 
          onChange={(e) => setFormName(e.target.value)}
          placeholder="e.g. John Doe"
          className="bg-surface border border-outline-variant rounded-lg p-3 text-on-surface font-body-md focus:outline-none focus:border-primary"
          autoFocus
        />
      </div>
      
      <div className="flex flex-col gap-1">
        <label className="font-label-sm text-[12px] text-on-surface-variant">Phone Number</label>
        <input 
          type="tel" 
          value={formPhone} 
          onChange={(e) => setFormPhone(e.target.value)}
          placeholder="e.g. +1 555 123 4567"
          className="bg-surface border border-outline-variant rounded-lg p-3 text-on-surface font-body-md focus:outline-none focus:border-primary"
        />
      </div>
      
      <div className="flex justify-end gap-2 mt-1">
        <button 
          type="button" 
          onClick={resetForm}
          className="px-4 py-2.5 text-secondary font-label-md hover:bg-surface-container rounded-lg transition-colors min-h-[40px]"
        >
          Cancel
        </button>
        <button 
          type="submit"
          className="px-6 py-2.5 bg-primary text-on-primary font-label-md rounded-lg hover:bg-surface-tint shadow-sm transition-colors min-h-[40px] flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[16px]">{isEdit ? 'save' : 'add'}</span>
          {isEdit ? 'Save Changes' : 'Save Contact'}
        </button>
      </div>
    </form>
  );

  return (
    <div className="bg-background text-on-background min-h-[100dvh] flex flex-col pb-[env(safe-area-inset-bottom)]">
      <TopBar />

      <main className="flex-grow px-4 pt-[72px] pb-[96px] flex flex-col gap-3 max-w-2xl mx-auto w-full overflow-y-auto">
        <div className="mb-1">
          <h1 className="font-headline-xl text-headline-xl text-on-surface mb-1">Emergency Contacts</h1>
          <p className="font-body-md text-body-md text-secondary">Manage who gets notified in an emergency.</p>
        </div>

        <button 
          onClick={handleNotifyAll}
          className="w-full bg-primary text-on-primary rounded-xl py-3.5 px-5 flex items-center justify-center gap-3 shadow-[0_8px_24px_rgba(175,16,26,0.15)] hover:bg-surface-tint active:scale-[0.98] transition-all duration-200 min-h-[48px] relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-xl opacity-0 group-hover:opacity-100"></div>
          <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>campaign</span>
          <span className="font-label-xl text-label-xl">Notify All Contacts Now</span>
        </button>

        {/* Emergency Message Preview */}
        <div className="bg-surface-container-lowest border border-surface-variant rounded-xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>sms</span>
            <h2 className="font-label-xl text-label-xl text-on-surface">Emergency Message Preview</h2>
          </div>
          
          {isEditingTemplate ? (
            <div className="flex flex-col gap-3">
              <textarea
                value={tempTemplate}
                onChange={(e) => setTempTemplate(e.target.value)}
                placeholder="Enter custom SOS template message..."
                className="w-full p-3 border border-outline-variant rounded-xl text-body-md text-on-surface bg-surface focus:outline-none focus:border-primary"
                rows={3}
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditingTemplate(false)}
                  className="px-4 py-2 text-secondary font-label-md hover:bg-surface-container rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSosTemplate(tempTemplate.trim() || 'EMERGENCY: I need urgent roadside assistance. My live location is attached below.');
                    setIsEditingTemplate(false);
                  }}
                  className="px-5 py-2 bg-primary text-on-primary font-label-md rounded-lg hover:bg-surface-tint shadow-sm transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-surface-container-low p-3 rounded-lg relative">
                <p className="font-body-md text-body-md text-on-surface-variant text-[14px]">
                  "{sosTemplate || 'EMERGENCY: I need urgent roadside assistance. My live location is attached below.'}"
                </p>
                <div className="mt-2 h-16 rounded-md overflow-hidden relative bg-surface-container">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBazlWqfFNsSBw9rFym4hGrGCkrJzro3ZTQJ8f7Cn2qvd_d01Prf-BqaXA58Ga334-3jn8z4XiENusht7f6wFtV9GjtsSFEaY40sPG46JvRAKF7zhg0vC088OXegr8vWdLX4X6vBxWrHBvs7ijWqeWAOIgByWvO0mM4Cmb6uU_UlcSWQElyGLZsquHiEFzd_nBN9q1EqD9AI3HOpOG-mdX_jWoMgIkOmm3kkycnVIYQgix4LJ3pRFY99UVrA7jNTw-p7sJaJNfWqls" alt="Map preview" className="w-full h-full object-cover opacity-80" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => {
                  setTempTemplate(sosTemplate || 'EMERGENCY: I need urgent roadside assistance. My live location is attached below.');
                  setIsEditingTemplate(true);
                }}
                className="text-primary font-label-md text-label-md flex items-center gap-1 self-start hover:underline"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
                Edit Default Message
              </button>
            </>
          )}
        </div>

        {/* Trusted Contacts Header */}
        <div className="flex justify-between items-center mt-1">
          <h2 className="font-label-xl text-label-xl text-on-surface">Trusted Contacts ({contacts?.length || 0})</h2>
          {!isAdding && !editingId && (
            <button 
              onClick={startAdd}
              className="bg-secondary-container text-on-secondary-container hover:bg-surface-variant rounded-full px-4 py-2 flex items-center gap-2 transition-colors min-h-[40px]"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              <span className="font-label-md text-label-md">Add New</span>
            </button>
          )}
        </div>

        {/* Add Contact Form */}
        {isAdding && <ContactForm isEdit={false} />}

        {/* Contact Cards */}
        <div className="flex flex-col gap-3 pb-4">
          {contacts && contacts.length > 0 ? (
            contacts.map((contact) => (
              <div key={contact.id}>
                {editingId === contact.id ? (
                  <ContactForm isEdit={true} />
                ) : (
                  <div className="bg-surface-container-lowest border border-surface-variant rounded-xl p-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-center justify-between min-h-[64px]">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center font-headline-lg text-[18px] flex-shrink-0 ${contact.color || 'bg-primary-container text-on-primary-container'}`}>
                        {contact.initial || contact.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-label-xl text-label-xl text-on-surface truncate">{contact.name}</h3>
                        <p className="font-body-md text-[14px] text-secondary truncate">{contact.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                      <button 
                        aria-label="Edit Contact" 
                        onClick={() => startEdit(contact)}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-primary bg-primary/5 hover:bg-primary/15 transition-colors"
                      >
                        <span className="material-symbols-outlined text-xl">edit</span>
                      </button>
                      {deleteConfirmId === contact.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            aria-label="Confirm Delete"
                            onClick={() => handleDelete(contact.id)}
                            className="w-10 h-10 rounded-full flex items-center justify-center text-on-error bg-error hover:bg-error/80 transition-colors"
                          >
                            <span className="material-symbols-outlined text-xl">check</span>
                          </button>
                          <button
                            aria-label="Cancel Delete"
                            onClick={() => setDeleteConfirmId(null)}
                            className="w-10 h-10 rounded-full flex items-center justify-center text-secondary hover:bg-surface-container transition-colors"
                          >
                            <span className="material-symbols-outlined text-xl">close</span>
                          </button>
                        </div>
                      ) : (
                        <button 
                          aria-label="Delete Contact" 
                          onClick={() => setDeleteConfirmId(contact.id)}
                          className="w-10 h-10 rounded-full flex items-center justify-center text-error/70 bg-error-container/30 hover:bg-error-container hover:text-error transition-colors"
                        >
                          <span className="material-symbols-outlined text-xl">delete</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="py-10 flex flex-col items-center justify-center bg-surface-container-lowest rounded-xl border border-dashed border-outline-variant text-center px-4">
              <span className="material-symbols-outlined text-[40px] text-outline mb-3">group_off</span>
              <p className="font-label-xl text-label-xl text-on-surface mb-1">No emergency contacts added</p>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mb-4 text-[14px]">Add trusted people so they can be notified instantly during emergencies.</p>
              <button onClick={startAdd} className="bg-primary text-on-primary rounded-full px-6 py-2.5 flex items-center gap-2 hover:bg-surface-tint min-h-[40px]">
                <span className="material-symbols-outlined text-sm">add</span>
                <span className="font-label-md text-label-md">Add Contact Now</span>
              </button>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default EmergencyContacts;
