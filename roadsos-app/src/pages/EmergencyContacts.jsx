import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import useAppStore from '../store/appStore';

const EmergencyContacts = () => {
  const navigate = useNavigate();
  const { contacts, removeContact, addContact, sosTemplate, setSosTemplate } = useAppStore();
  
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const [isEditingTemplate, setIsEditingTemplate] = useState(false);
  const [tempTemplate, setTempTemplate] = useState('');

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) {
      setErrorMsg('Name and phone number are required.');
      return;
    }
    // Basic phone validation
    const phoneRegex = /^[+]?[\d\s-]{7,15}$/;
    if (!phoneRegex.test(newPhone)) {
      setErrorMsg('Please enter a valid phone number.');
      return;
    }

    const newContact = {
      id: Date.now().toString(),
      name: newName.trim(),
      phone: newPhone.trim(),
      initial: newName.trim().charAt(0).toUpperCase(),
      color: 'bg-primary-container text-on-primary-container'
    };

    console.log("Adding new contact:", newContact);
    addContact(newContact);
    
    // Clear form
    setNewName('');
    setNewPhone('');
    setErrorMsg('');
    setIsAdding(false);
  };

  const handleNotifyAll = () => {
    navigate('/sos');
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col pt-[64px] pb-safe-bottom-zone md:pb-0">
      <TopBar />

      <main className="flex-grow px-margin-mobile py-baseline flex flex-col gap-baseline max-w-2xl mx-auto w-full mt-4">
        <div className="mb-4">
          <h1 className="font-headline-xl text-headline-xl text-on-surface mb-2">Emergency Contacts</h1>
          <p className="font-body-lg text-body-lg text-secondary">Manage who gets notified in an emergency.</p>
        </div>

        <button 
          onClick={handleNotifyAll}
          className="w-full bg-primary text-on-primary rounded-xl py-4 px-6 flex items-center justify-center gap-3 shadow-[0_8px_24px_rgba(175,16,26,0.15)] hover:bg-surface-tint active:scale-95 transition-all duration-200 min-h-touch-target-min mb-6 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-xl opacity-0 group-hover:opacity-100"></div>
          <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>campaign</span>
          <span className="font-label-xl text-label-xl">Notify All Contacts Now</span>
        </button>

        <div className="bg-surface-container-lowest border border-surface-variant rounded-xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] mb-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
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
              <div className="bg-surface-container-low p-4 rounded-lg relative">
                <p className="font-body-md text-body-md text-on-surface-variant">
                  "{sosTemplate || 'EMERGENCY: I need urgent roadside assistance. My live location is attached below.'}"
                </p>
                <div className="mt-3 h-24 rounded-md overflow-hidden relative bg-surface-container">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBazlWqfFNsSBw9rFym4hGrGCkrJzro3ZTQJ8f7Cn2qvd_d01Prf-BqaXA58Ga334-3jn8z4XiENusht7f6wFtV9GjtsSFEaY40sPG46JvRAKF7zhg0vC088OXegr8vWdLX4X6vBxWrHBvs7ijWqeWAOIgByWvO0mM4Cmb6uU_UlcSWQElyGLZsquHiEFzd_nBN9q1EqD9AI3HOpOG-mdX_jWoMgIkOmm3kkycnVIYQgix4LJ3pRFY99UVrA7jNTw-p7sJaJNfWqls" alt="Map preview" className="w-full h-full object-cover opacity-80" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
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

        <div className="flex justify-between items-center mb-2">
          <h2 className="font-label-xl text-label-xl text-on-surface">Trusted Contacts</h2>
          {!isAdding && (
            <button 
              onClick={() => setIsAdding(true)}
              className="bg-secondary-container text-on-secondary-container hover:bg-surface-variant rounded-full px-4 py-2 flex items-center gap-2 transition-colors min-h-touch-target-min"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              <span className="font-label-md text-label-md">Add New</span>
            </button>
          )}
        </div>

        {isAdding && (
          <form onSubmit={handleAddSubmit} className="bg-surface-container-low border border-primary/30 rounded-xl p-4 shadow-sm mb-6 flex flex-col gap-4">
            <h3 className="font-label-lg text-label-lg text-on-surface">Add New Contact</h3>
            {errorMsg && <p className="text-error font-body-sm text-[12px]">{errorMsg}</p>}
            
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-[12px] text-on-surface-variant">Name</label>
              <input 
                type="text" 
                value={newName} 
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. John Doe"
                className="bg-surface border border-outline-variant rounded-lg p-3 text-on-surface font-body-md focus:outline-none focus:border-primary"
                autoFocus
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-[12px] text-on-surface-variant">Phone Number</label>
              <input 
                type="tel" 
                value={newPhone} 
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="e.g. +1 555 123 4567"
                className="bg-surface border border-outline-variant rounded-lg p-3 text-on-surface font-body-md focus:outline-none focus:border-primary"
              />
            </div>
            
            <div className="flex justify-end gap-2 mt-2">
              <button 
                type="button" 
                onClick={() => { setIsAdding(false); setErrorMsg(''); }}
                className="px-4 py-2 text-secondary font-label-md hover:bg-surface-container rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-6 py-2 bg-primary text-on-primary font-label-md rounded-lg hover:bg-surface-tint shadow-sm transition-colors"
              >
                Save Contact
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {contacts && contacts.length > 0 ? (
            contacts.map((contact) => (
              <div key={contact.id} className="bg-surface-container-lowest border border-surface-variant rounded-xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex items-center justify-between min-h-touch-target-min relative group">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-headline-lg ${contact.color || 'bg-primary-container text-on-primary-container'}`}>
                    {contact.initial || contact.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-label-xl text-label-xl text-on-surface">{contact.name}</h3>
                    <p className="font-body-md text-body-md text-secondary">{contact.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button aria-label="Edit Contact" className="w-10 h-10 rounded-full flex items-center justify-center text-secondary hover:bg-surface-container hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-xl">edit</span>
                  </button>
                  <button 
                    aria-label="Delete Contact" 
                    onClick={() => removeContact(contact.id)}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-secondary hover:bg-error-container hover:text-error transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">delete</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 flex flex-col items-center justify-center bg-surface-container-lowest rounded-xl border border-dashed border-outline-variant text-center">
              <span className="material-symbols-outlined text-[48px] text-outline mb-4">group_off</span>
              <p className="font-label-xl text-label-xl text-on-surface mb-2">No emergency contacts added</p>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mb-4">You currently have no emergency contacts. Add trusted people so they can be notified instantly.</p>
              <button onClick={() => setIsAdding(true)} className="bg-primary text-on-primary rounded-full px-6 py-2 flex items-center gap-2 hover:bg-surface-tint">
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
