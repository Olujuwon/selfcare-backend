export const signupEmailTemplate = {
  personalizations: [
    {
      to: [
        {
          email: '',
          name: '',
        },
      ],
    },
  ],
  from: {
    email: 'ayoalabi0@gmail.com',
    name: 'Selfcare administrator',
  },
  subject: 'Account created! Verify email address',
  content: [
    {
      type: 'text/html',
      value: 'Hello world',
    },
  ],
  attachments: [
    {
      content:
        'PCFET0NUWVBFIGh0bWw+CjxodG1sIGxhbmc9ImVuIj4KCiAgICA8aGVhZD4KICAgICAgICA8bWV0YSBjaGFyc2V0PSJVVEYtOCI' +
        '+CiAgICAgICAgPG1ldGEgaHR0cC1lcXVpdj0iWC1VQS1Db21wYXRpYmxlIiBjb250ZW50PSJJRT1lZGdlIj4KICAgICAgICA8b' +
        'WV0YSBuYW1lPSJ2aWV3cG9ydCIgY29udGVudD0id2lkdGg9ZGV2aWNlLXdpZHRoLCBpbml0aWFsLXNjYWxlPTEu' +
        'MCI+CiAgICAgICAgPHRpdGxlPkRvY3VtZW50PC90aXRsZT4KICAgIDwvaGVhZD4KCiAgICA8Ym9keT4KCiAgICA8L' +
        '2JvZHk+Cgo8L2h0bWw+Cg==',
      filename: 'index.html',
      type: 'text/html',
      disposition: 'attachment',
    },
  ],
  '-buttonUrl-': '',
  categories: ['account-created-verification'],
  template_id: 'd-eb3136bb4fc543a9bc81eca78c2bd5e2',
};

export const resetEmailTemplate = {
  personalizations: [
    {
      to: [
        {
          email: '',
          name: '',
        },
      ],
    },
  ],
  from: {
    email: 'ayoalabi0@gmail.com',
    name: 'Selfcare administrator',
  },
  subject: '',
  content: [
    {
      type: 'text/html',
      value: 'Hello world',
    },
  ],
  attachments: [
    {
      content:
        'PCFET0NUWVBFIGh0bWw+CjxodG1sIGxhbmc9ImVuIj4KCiAgICA8aGVhZD4KICAgICAgICA8bWV0YSBjaGFyc2V0PSJVVEYtOCI' +
        '+CiAgICAgICAgPG1ldGEgaHR0cC1lcXVpdj0iWC1VQS1Db21wYXRpYmxlIiBjb250ZW50PSJJRT1lZGdlIj4KICAgICAgICA8b' +
        'WV0YSBuYW1lPSJ2aWV3cG9ydCIgY29udGVudD0id2lkdGg9ZGV2aWNlLXdpZHRoLCBpbml0aWFsLXNjYWxlPTEu' +
        'MCI+CiAgICAgICAgPHRpdGxlPkRvY3VtZW50PC90aXRsZT4KICAgIDwvaGVhZD4KCiAgICA8Ym9keT4KCiAgICA8L' +
        '2JvZHk+Cgo8L2h0bWw+Cg==',
      filename: 'index.html',
      type: 'text/html',
      disposition: 'attachment',
    },
  ],
  buttonUrl: '',
  categories: ['password_reset_initial'],
  template_id: 'd-17ae1f9ef66045fc8d460b6c5bf6a742',
};
