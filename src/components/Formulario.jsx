import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';

export default function Formulario(){
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm('service_rr1xnzg', 'template_jz3o1va', form.current, {
        publicKey: 'dfKGZy2pLAKG9ITiK',
      })
      .then(
        () => {
          console.log('SUCCESS!');
        },
        (error) => {
          console.log('FAILED...', error.text);
        },
      );
  };

  return (
    <form ref={form} onSubmit={sendEmail} className="flex flex-col gap-4 w-full max-w-md mx-auto p-4">
      <label className="font-semibold">Name</label>
      <input
        type="text"
        name="user_name"
        className="border p-2 rounded"
        required
      />

      <label className="font-semibold">Email</label>
      <input
        type="email"
        name="user_email"
        className="border p-2 rounded"
        required
      />

      <label className="font-semibold">Subject</label>
      <input
        type="text"
        name="subject"
        className="border p-2 rounded"
        required
      />

      <label className="font-semibold">Message</label>
      <textarea
        name="message"
        className="border p-2 rounded"
        required
      />

      <input
        type="submit"
        value="Send"
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 cursor-pointer"
      />
    </form>
  );
};
  