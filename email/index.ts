import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

//Refactor this
export interface IEmailMessage {
  to: string;
  from: string;
  subject: string;
  text: string;
  html: string;
}

export const sendEmailMessage = async (message: any): Promise<sgMail.ClientResponse | sgMail.ResponseError> => {
  try {
    const sentEmail = await sgMail.send(message);
    return sentEmail[0];
  } catch (error: any) {
    return error;
  }
};
