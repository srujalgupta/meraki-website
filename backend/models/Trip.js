const mongoose = require("mongoose");

const createBoundedString = (maxLength, extra = {}) => ({
  type: String,
  trim: true,
  maxlength: maxLength,
  ...extra,
});

const createStringArrayField = (maxItems, itemMaxLength) => ({
  type: [createBoundedString(itemMaxLength)],
  default: [],
  validate: {
    validator(value) {
      return value.length <= maxItems;
    },
    message: `This field supports up to ${maxItems} items.`,
  },
});

const itineraryItemSchema = new mongoose.Schema(
  {
    title: createBoundedString(140, { required: true }),
    description: createBoundedString(600, { required: true }),
  },
  { _id: false }
);

const faqSchema = new mongoose.Schema(
  {
    question: createBoundedString(180, { required: true }),
    answer: createBoundedString(500, { required: true }),
  },
  { _id: false }
);

const batchDateSchema = new mongoose.Schema(
  {
    date: createBoundedString(60, { required: true }),
    slots: {
      type: Number,
      min: 0,
      max: 500,
    },
  },
  { _id: false }
);

const packageSchema = new mongoose.Schema(
  {
    name: createBoundedString(160, { required: true }),
    price: {
      type: Number,
      required: true,
      min: 0,
      max: 1000000,
    },
    duration: createBoundedString(80),
    pdf: createBoundedString(220),
  },
  { _id: false }
);

const tripSchema = new mongoose.Schema(
  {
    title: createBoundedString(160, { required: true }),
    location: createBoundedString(160, { required: true }),
    price: {
      type: Number,
      required: true,
      min: 0,
      max: 1000000,
    },
    duration: createBoundedString(80, { required: true }),
    image: createBoundedString(300, { required: true }),
    description: createBoundedString(500),
    about: createBoundedString(1800),
    bestFor: createStringArrayField(12, 180),
    highlights: createStringArrayField(12, 180),
    itinerary: {
      type: [itineraryItemSchema],
      default: [],
      validate: {
        validator(value) {
          return value.length <= 12;
        },
        message: "Itinerary supports up to 12 entries.",
      },
    },
    inclusions: createStringArrayField(20, 180),
    exclusions: createStringArrayField(20, 180),
    gallery: createStringArrayField(24, 300),
    thingsToPack: createStringArrayField(20, 180),
    faqs: {
      type: [faqSchema],
      default: [],
      validate: {
        validator(value) {
          return value.length <= 12;
        },
        message: "FAQs support up to 12 entries.",
      },
    },
    batchDates: {
      type: [batchDateSchema],
      default: [],
      validate: {
        validator(value) {
          return value.length <= 20;
        },
        message: "Batch dates support up to 20 entries.",
      },
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    category: createBoundedString(120),
    trending: {
      type: Boolean,
      default: false,
    },
    packages: {
      type: [packageSchema],
      default: [],
      validate: {
        validator(value) {
          return value.length <= 10;
        },
        message: "Packages support up to 10 entries.",
      },
    },
  },
  {
    minimize: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("Trip", tripSchema);
