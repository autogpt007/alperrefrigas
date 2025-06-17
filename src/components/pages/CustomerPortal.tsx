
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Clock, CheckCircle, Phone } from 'lucide-react';

const CustomerPortal = () => {
  // Mock data - in real app, this would come from Firestore based on user
  const quoteHistory = [
    {
      id: 'RFQ-2024-001',
      submittedAt: '2024-01-15',
      status: 'Fulfilled',
      items: [
        { productName: 'R-410A', quantity: 2, packaging: 'Pallet (48 cylinders)' },
        { productName: 'R-134a', quantity: 1, packaging: 'Container (800 cylinders)' }
      ]
    },
    {
      id: 'RFQ-2024-002',
      submittedAt: '2024-01-20',
      status: 'Contacted',
      items: [
        { productName: 'R-404A', quantity: 3, packaging: 'Pallet (45 cylinders)' }
      ]
    },
    {
      id: 'RFQ-2024-003',
      submittedAt: '2024-01-22',
      status: 'New',
      items: [
        { productName: 'R-410A', quantity: 1, packaging: 'Bulk Tank (1000 lbs)' },
        { productName: 'R-134a', quantity: 2, packaging: 'Pallet (40 cylinders)' }
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'New':
        return <Clock className="h-4 w-4" />;
      case 'Contacted':
        return <Phone className="h-4 w-4" />;
      case 'Fulfilled':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800';
      case 'Contacted':
        return 'bg-yellow-100 text-yellow-800';
      case 'Fulfilled':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Portal</h1>
          <p className="text-gray-600">Track your quote requests and order history</p>
        </div>

        {/* Quote History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Quote Request History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {quoteHistory.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No quote requests found</p>
                <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                  Submit Your First Quote Request
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {quoteHistory.map((quote) => (
                  <div key={quote.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{quote.id}</h3>
                        <p className="text-sm text-gray-600">
                          Submitted on {new Date(quote.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={getStatusColor(quote.status)}>
                        {getStatusIcon(quote.status)}
                        <span className="ml-1">{quote.status}</span>
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-700">Items:</h4>
                      {quote.items.map((item, index) => (
                        <div key={index} className="text-sm text-gray-600 ml-4">
                          • {item.quantity}x {item.productName} - {item.packaging}
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 flex space-x-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      {quote.status === 'New' && (
                        <Button variant="outline" size="sm">
                          Modify Request
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Contact Information</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Email: customer@example.com</p>
                  <p>Phone: (555) 123-4567</p>
                  <p>Company: ACME HVAC Solutions</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Account Status</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Member since: January 2024</p>
                  <p>Total quotes: {quoteHistory.length}</p>
                  <p>Account type: Business</p>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Button variant="outline">Update Account Information</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerPortal;
