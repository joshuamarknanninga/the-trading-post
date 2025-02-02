import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useDropzone } from 'react-dropzone';

const PdfLibrary = () => {
  const { user } = useAuth();
  const stripe = useStripe();
  const elements = useElements();
  const [activeTab, setActiveTab] = useState('sell');
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    isFree: false,
  });
  const [feeDetails, setFeeDetails] = useState({
    platformFee: 0,
    totalPayout: 0,
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'application/pdf',
    onDrop: acceptedFiles => setFile(acceptedFiles[0]),
  });

  const calculateFees = (price) => {
    const fee = price * 0.07;
    return {
      platformFee: fee,
      totalPayout: price - fee
    };
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) return;

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    if (error) {
      console.error(error);
      return;
    }

    // Submit to your backend
    const response = await fetch('/api/pdfs/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        file,
        paymentMethodId: paymentMethod.id,
        userId: user.id
      }),
    });

    // Handle response
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab('sell')}
          className={`pb-2 px-4 ${activeTab === 'sell' ? 'border-b-2 border-green-600' : ''}`}
        >
          Sell PDF Books
        </button>
        <button
          onClick={() => setActiveTab('free')}
          className={`pb-2 px-4 ${activeTab === 'free' ? 'border-b-2 border-green-600' : ''}`}
        >
          Free PDF Library
        </button>
      </div>

      {activeTab === 'sell' ? (
        <form onSubmit={handlePaymentSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">PDF File</label>
            <div
              {...getRootProps()}
              className="border-2 border-dashed p-6 text-center cursor-pointer hover:border-green-500"
            >
              <input {...getInputProps()} />
              {file ? (
                <div>
                  <p>{file.name}</p>
                  <PDFViewer width="100%" height="300px">
                    <YourPdfDocument file={file} />
                  </PDFViewer>
                </div>
              ) : (
                <p>Drag & drop PDF file here, or click to select</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Price ($)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => {
                  const price = parseFloat(e.target.value);
                  setFormData({ ...formData, price });
                  setFeeDetails(calculateFees(price));
                }}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 border rounded-lg h-32"
              required
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Payment Information</h3>
            <CardElement className="p-2 border rounded-lg bg-white" />
            
            <div className="mt-4 space-y-2">
              <p>Platform Fee (7%): ${feeDetails.platformFee.toFixed(2)}</p>
              <p className="font-medium">You Receive: ${feeDetails.totalPayout.toFixed(2)}</p>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary w-full"
            disabled={!stripe || !file}
          >
            Publish PDF Book
          </button>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Share Free PDF</h3>
            {/* Similar form without payment fields */}
            <input type="file" accept="application/pdf" />
            <input type="text" placeholder="Title" />
            <textarea placeholder="Description" />
            <button className="btn-secondary">Upload Free PDF</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Example PDF listing */}
            <div className="border rounded-lg p-4 hover:shadow-lg">
              <h4 className="font-medium">Free Gardening Guide</h4>
              <p className="text-sm text-gray-600 mb-2">By Community Member</p>
              <PDFDownloadLink document={<SampleDoc />} fileName="guide.pdf">
                {({ loading }) => (
                  <button className="btn-secondary w-full">
                    {loading ? 'Loading...' : 'Download'}
                  </button>
                )}
              </PDFDownloadLink>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfLibrary;