# ============================================================
# STEP 2 - LOAD AND PREPROCESS BRAIN MRI IMAGES
# ============================================================

import os
import tensorflow as tf

from tensorflow.keras.preprocessing.image import ImageDataGenerator


# ============================================================
# 1. CLASSES
# ============================================================

classes = [
    "glioma",
    "meningioma",
    "notumor",
    "pituitary"
]


# ============================================================
# 2. SETTINGS
# ============================================================

IMG_SIZE = (160, 160)
BATCH_SIZE = 16

TRAIN_DIR = "Training"
TEST_DIR = "Testing"


# ============================================================
# 3. TRAINING DATA GENERATOR
# ============================================================

train_datagen = ImageDataGenerator(

    # Normalize pixel values
    rescale=1.0 / 255,

    # Use 10% of training data for validation
    validation_split=0.10,

    # Light data augmentation
    rotation_range=8,
    width_shift_range=0.08,
    height_shift_range=0.08,
    zoom_range=0.08,
    horizontal_flip=True
)


# ============================================================
# 4. VALIDATION DATA GENERATOR
# ============================================================

validation_datagen = ImageDataGenerator(

    # Only normalization
    rescale=1.0 / 255,

    validation_split=0.10
)


# ============================================================
# 5. TEST DATA GENERATOR
# ============================================================

test_datagen = ImageDataGenerator(

    # Only normalization
    rescale=1.0 / 255
)


# ============================================================
# 6. LOAD TRAINING IMAGES
# ============================================================

train_data = train_datagen.flow_from_directory(

    TRAIN_DIR,

    target_size=IMG_SIZE,

    batch_size=BATCH_SIZE,

    class_mode="categorical",

    subset="training",

    shuffle=True
)


# ============================================================
# 7. LOAD VALIDATION IMAGES
# ============================================================

validation_data = validation_datagen.flow_from_directory(

    TRAIN_DIR,

    target_size=IMG_SIZE,

    batch_size=BATCH_SIZE,

    class_mode="categorical",

    subset="validation",

    shuffle=False
)


# ============================================================
# 8. LOAD TESTING IMAGES
# ============================================================

test_data = test_datagen.flow_from_directory(

    TEST_DIR,

    target_size=IMG_SIZE,

    batch_size=BATCH_SIZE,

    class_mode="categorical",

    shuffle=False
)


# ============================================================
# 9. DISPLAY INFORMATION
# ============================================================

print("\nClass mapping:")
print(train_data.class_indices)

print("\nTraining images:", train_data.samples)

print("Validation images:", validation_data.samples)

print("Testing images:", test_data.samples)

print("\nStep 2 completed successfully!")

# ============================================================
# STEP 3 - DISPLAY SAMPLE MRI IMAGES
# ============================================================

import matplotlib.pyplot as plt

images, labels = next(train_data)

plt.figure(figsize=(10, 8))

for i in range(9):
    plt.subplot(3, 3, i + 1)

    plt.imshow(images[i])

    class_index = labels[i].argmax()

    plt.title(classes[class_index])

    plt.axis("off")

plt.tight_layout()
plt.show()

print("\nStep 3 completed successfully!")


# ============================================================
# STEP 4 - BUILD CNN MODEL
# ============================================================

from tensorflow.keras.models import Sequential

from tensorflow.keras.layers import (
    Input,
    Conv2D,
    MaxPooling2D,
    Flatten,
    Dense,
    Dropout
)


model = Sequential([

    Input(shape=(160, 160, 3)),

    Conv2D(
        32,
        (3, 3),
        activation="relu"
    ),

    MaxPooling2D(
        pool_size=(2, 2)
    ),

    Conv2D(
        64,
        (3, 3),
        activation="relu"
    ),

    MaxPooling2D(
        pool_size=(2, 2)
    ),

    Conv2D(
        128,
        (3, 3),
        activation="relu"
    ),

    MaxPooling2D(
        pool_size=(2, 2)
    ),

    Flatten(),

    Dense(
        128,
        activation="relu"
    ),

    Dropout(0.5),

    Dense(
        4,
        activation="softmax"
    )
])


# ============================================================
# DISPLAY CNN MODEL
# ============================================================

print("\nCNN MODEL SUMMARY")
print("=" * 60)

model.summary()

print("\nStep 4 completed successfully!")

# ============================================================
# STEP 5 — COMPILE CNN MODEL
# ============================================================

model.compile(
    optimizer="adam",
    loss="categorical_crossentropy",
    metrics=["accuracy"]
)

print("\nStep 5 completed successfully!")

# ============================================================
# ============================================================
# STEP 6 — QUICK CNN TRAINING
# ============================================================

from tensorflow.keras.callbacks import EarlyStopping

# Reduce dataset size for faster CPU training
train_data.samples = min(train_data.samples, 1000)
validation_data.samples = min(validation_data.samples, 200)
test_data.samples = min(test_data.samples, 300)

# Number of batches to use
train_steps = 1000 // BATCH_SIZE
validation_steps = 200 // BATCH_SIZE

EPOCHS = 3

early_stopping = EarlyStopping(
    monitor="val_loss",
    patience=1,
    restore_best_weights=True
)

print("\nQUICK CNN TRAINING STARTED")
print("=" * 60)

history = model.fit(
    train_data,
    steps_per_epoch=train_steps,
    validation_data=validation_data,
    validation_steps=validation_steps,
    epochs=EPOCHS,
    callbacks=[early_stopping]
)

print("\nStep 6 completed successfully!")

# ============================================================
# STEP 7 — EVALUATE CNN ON TEST DATA
# ============================================================

print("\nTESTING CNN MODEL")
print("=" * 60)

test_loss, test_accuracy = model.evaluate(
    test_data,
    verbose=1
)

print("\nTest Loss     :", test_loss)
print("Test Accuracy :", test_accuracy)
print("Test Accuracy :", round(test_accuracy * 100, 2), "%")

print("\nStep 7 completed successfully!")

# ============================================================
# STEP 8 — CLASSIFICATION REPORT
# ============================================================

from sklearn.metrics import classification_report
import numpy as np

print("\nGENERATING CLASSIFICATION REPORT")
print("=" * 60)

# Reset test generator
test_data.reset()

# Predict test images
predictions = model.predict(
    test_data,
    verbose=1
)

# Convert probabilities to class numbers
y_pred = np.argmax(predictions, axis=1)

# Actual class numbers
y_true = test_data.classes

print("\nCLASSIFICATION REPORT")
print("=" * 60)

print(
    classification_report(
        y_true,
        y_pred,
        target_names=classes
    )
)

print("Step 8 completed successfully!")

# ============================================================
# STEP 9 — CONFUSION MATRIX
# ============================================================

from sklearn.metrics import confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns

print("\nGENERATING CONFUSION MATRIX")
print("=" * 60)

cm = confusion_matrix(y_true, y_pred)

print("\nConfusion Matrix:")
print(cm)

plt.figure(figsize=(8, 6))

sns.heatmap(
    cm,
    annot=True,
    fmt="d",
    xticklabels=classes,
    yticklabels=classes
)

plt.xlabel("Predicted Class")
plt.ylabel("Actual Class")
plt.title("Brain Tumor CNN - Confusion Matrix")

plt.tight_layout()
plt.show()

print("\nStep 9 completed successfully!")

# ============================================================
# STEP 10 — TRAINING AND VALIDATION GRAPHS
# ============================================================

import matplotlib.pyplot as plt


print("\nGENERATING TRAINING GRAPHS")
print("=" * 60)

# -------------------------
# Accuracy graph
# -------------------------

plt.figure(figsize=(8, 5))

plt.plot(
    history.history["accuracy"],
    label="Training Accuracy"
)

plt.plot(
    history.history["val_accuracy"],
    label="Validation Accuracy"
)

plt.title("CNN Training vs Validation Accuracy")
plt.xlabel("Epoch")
plt.ylabel("Accuracy")
plt.legend()
plt.grid()

plt.show()


# -------------------------
# Loss graph
# -------------------------

plt.figure(figsize=(8, 5))

plt.plot(
    history.history["loss"],
    label="Training Loss"
)

plt.plot(
    history.history["val_loss"],
    label="Validation Loss"
)

plt.title("CNN Training vs Validation Loss")
plt.xlabel("Epoch")
plt.ylabel("Loss")
plt.legend()
plt.grid()

plt.show()

print("\nStep 10 completed successfully!")

# ============================================================
# STEP 11 — SAVE TRAINED CNN MODEL
# ============================================================

MODEL_PATH = "brain_tumor_cnn.keras"

model.save(MODEL_PATH)

print("\nMODEL SAVED SUCCESSFULLY!")
print("Model file:", MODEL_PATH)
print("Step 11 completed successfully!")