import React, { useState, useEffect } from 'react';
import { FilingGuide } from '../../types';
import { BookOpen, ChevronRight, ChevronLeft, CheckCircle, Circle, Play } from 'lucide-react';

const FilingGuides: React.FC = () => {
  const [guides, setGuides] = useState<FilingGuide[]>([]);
  const [selectedGuide, setSelectedGuide] = useState<FilingGuide | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    loadGuides();
  }, []);

  const loadGuides = () => {
    const savedGuides = JSON.parse(localStorage.getItem('filingGuides') || '[]');
    
    // Add more sample guides if none exist
    if (savedGuides.length === 0) {
      const sampleGuides: FilingGuide[] = [
        {
          id: '1',
          title: 'GST Return Filing Guide',
          description: 'Step-by-step guide to file your monthly GST return',
          steps: [
            {
              id: '1',
              title: 'Gather Required Documents',
              content: 'Collect all sales invoices, purchase invoices, and payment receipts for the month. Ensure all documents are properly categorized and amounts are accurate.',
              isCompleted: false
            },
            {
              id: '2',
              title: 'Login to GST Portal',
              content: 'Access the official GST portal at https://www.gst.gov.in/ using your GSTIN and password. Navigate to the Returns section.',
              isCompleted: false
            },
            {
              id: '3',
              title: 'Fill GSTR-1',
              content: 'Enter all outward supply details in GSTR-1 form. Include B2B, B2C, exports, and other applicable transactions.',
              isCompleted: false
            },
            {
              id: '4',
              title: 'Review and Submit',
              content: 'Review all entered data for accuracy. Submit the return before the due date and download the acknowledgment.',
              isCompleted: false
            }
          ]
        },
        {
          id: '2',
          title: 'Income Tax Return Filing',
          description: 'Complete guide for filing your annual income tax return',
          steps: [
            {
              id: '1',
              title: 'Collect Documents',
              content: 'Gather Form 16, bank statements, investment proofs, and other relevant documents for the financial year.',
              isCompleted: false
            },
            {
              id: '2',
              title: 'Choose ITR Form',
              content: 'Select the appropriate ITR form based on your income sources and eligibility criteria.',
              isCompleted: false
            },
            {
              id: '3',
              title: 'Fill Personal Details',
              content: 'Enter your personal information, address, bank details, and other required information accurately.',
              isCompleted: false
            },
            {
              id: '4',
              title: 'Report Income',
              content: 'Report income from all sources including salary, house property, capital gains, and other sources.',
              isCompleted: false
            },
            {
              id: '5',
              title: 'Calculate Tax',
              content: 'Calculate total tax liability, claim deductions, and determine the final tax payable or refundable.',
              isCompleted: false
            },
            {
              id: '6',
              title: 'Verify and Submit',
              content: 'Verify the return using OTP or DSC, submit it, and download the acknowledgment receipt.',
              isCompleted: false
            }
          ]
        },
        {
          id: '3',
          title: 'TDS Return Filing',
          description: 'Guide for filing quarterly TDS returns',
          steps: [
            {
              id: '1',
              title: 'Prepare TDS Statements',
              content: 'Compile all TDS deductions for the quarter and ensure all required details are available.',
              isCompleted: false
            },
            {
              id: '2',
              title: 'Download FVU',
              content: 'Download the File Validation Utility (FVU) from the Income Tax website for the relevant quarter.',
              isCompleted: false
            },
            {
              id: '3',
              title: 'Prepare TDS File',
              content: 'Create the TDS return file using the FVU with all deductee and payment details.',
              isCompleted: false
            },
            {
              id: '4',
              title: 'Upload and Submit',
              content: 'Upload the validated file to the IT portal and submit the return before the due date.',
              isCompleted: false
            }
          ]
        }
      ];
      
      localStorage.setItem('filingGuides', JSON.stringify(sampleGuides));
      setGuides(sampleGuides);
    } else {
      setGuides(savedGuides);
    }
  };

  const updateGuideProgress = (guideId: string, stepId: string, isCompleted: boolean) => {
    const updatedGuides = guides.map(guide => {
      if (guide.id === guideId) {
        const updatedSteps = guide.steps.map(step =>
          step.id === stepId ? { ...step, isCompleted } : step
        );
        return { ...guide, steps: updatedSteps };
      }
      return guide;
    });

    setGuides(updatedGuides);
    localStorage.setItem('filingGuides', JSON.stringify(updatedGuides));

    // Update selected guide if it's the one being modified
    if (selectedGuide && selectedGuide.id === guideId) {
      const updatedSelectedGuide = updatedGuides.find(g => g.id === guideId);
      if (updatedSelectedGuide) {
        setSelectedGuide(updatedSelectedGuide);
      }
    }
  };

  const nextStep = () => {
    if (selectedGuide && currentStepIndex < selectedGuide.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const startGuide = (guide: FilingGuide) => {
    setSelectedGuide(guide);
    setCurrentStepIndex(0);
  };

  const getProgressPercentage = (guide: FilingGuide) => {
    const completedSteps = guide.steps.filter(step => step.isCompleted).length;
    return Math.round((completedSteps / guide.steps.length) * 100);
  };

  if (selectedGuide) {
    const currentStep = selectedGuide.steps[currentStepIndex];
    const isLastStep = currentStepIndex === selectedGuide.steps.length - 1;
    const isFirstStep = currentStepIndex === 0;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSelectedGuide(null)}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{selectedGuide.title}</h1>
              <p className="text-gray-600">{selectedGuide.description}</p>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Step {currentStepIndex + 1} of {selectedGuide.steps.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-600">{getProgressPercentage(selectedGuide)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgressPercentage(selectedGuide)}%` }}
            />
          </div>
          <div className="flex justify-between mt-4">
            {selectedGuide.steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center ${
                  index < selectedGuide.steps.length - 1 ? 'flex-1' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.isCompleted
                      ? 'bg-green-600 text-white'
                      : index === currentStepIndex
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {step.isCompleted ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                {index < selectedGuide.steps.length - 1 && (
                  <div className="flex-1 h-0.5 bg-gray-300 mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Current Step Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {currentStep.title}
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {currentStep.content}
                </p>
              </div>
            </div>
            <button
              onClick={() => updateGuideProgress(selectedGuide.id, currentStep.id, !currentStep.isCompleted)}
              className={`ml-6 flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                currentStep.isCompleted
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {currentStep.isCompleted ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <span>Completed</span>
                </>
              ) : (
                <>
                  <Circle className="h-4 w-4" />
                  <span>Mark Complete</span>
                </>
              )}
            </button>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              onClick={prevStep}
              disabled={isFirstStep}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>
            
            <button
              onClick={nextStep}
              disabled={isLastStep}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span>{isLastStep ? 'Complete' : 'Next'}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Filing Guides</h1>
        <p className="text-gray-600">Step-by-step guides for various compliance filings</p>
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guides.map(guide => {
          const progressPercentage = getProgressPercentage(guide);
          const completedSteps = guide.steps.filter(step => step.isCompleted).length;
          
          return (
            <div
              key={guide.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start space-x-4 mb-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {guide.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {guide.description}
                  </p>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700">
                    {completedSteps} of {guide.steps.length} steps completed
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {progressPercentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => startGuide(guide)}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Play className="h-4 w-4" />
                <span>{progressPercentage > 0 ? 'Continue' : 'Start Guide'}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {guides.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No filing guides available</h3>
          <p className="mt-1 text-sm text-gray-500">
            Filing guides will appear here to help you with compliance tasks.
          </p>
        </div>
      )}
    </div>
  );
};

export default FilingGuides;