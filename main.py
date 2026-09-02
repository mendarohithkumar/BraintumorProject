# ============================================================
# BRAIN TUMOR MRI CLASSIFICATION USING CNN
# ============================================================

import os
import numpy as np
import tensorflow as tf
import matplotlib.pyplot as plt
import seaborn as sns

from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D
from tensorflow.keras.layers import Flatten, Dense, Dropout, Input
from sklearn.metrics import classification_report, confusion_matrix


# ============================================================
# 1. CHECK NUMBER OF IMAGES IN EACH CLASS
# ============================================================

classes = ["glioma", "meningioma", "notumor", "pituitary"]

for cls in classes:

    training_path = os.path.join("Training", cls)
    testing_path = os.path.join("Testing", cls)

    training_count = len(os.listdir(training_path))
    testing_count = len(os.listdir(testing_path))

    print(
        cls,
        "Training =", training_count,
        "Testing =", testing_count
    )


# ============================================================
# 2. SETTINGS
# ============================================================

IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 20

TRAIN_DIR = "Training"
TEST_DIR = "Testing"


# ============================================================
# 3. TRAINING DATA
# ============================================================

train_datagen = ImageDataGenerator(
    rescale=1.0 / 255,
    validation_split=0.10,

    # Data augmentation
    rotation_range=10,
    width_shift_range=0.10,
    height_shift_range=0.10,
    zoom_range=0.10,
    horizontal_flip=True
)


train_data = train_datagen.flow_from_directory(
    TRAIN_DIR,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="categorical",
    subset="training",
    shuffle=True
)


# ============================================================
# 4. VALIDATION DATA
# ============================================================

validation_data = train_datagen.flow_from_directory(
    TRAIN_DIR,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="categorical",
    subset="validation",
    shuffle=False
)


# ============================================================
# 5. TESTING DATA
# ============================================================

test_datagen = ImageDataGenerator(
    rescale=1.0 / 255
)


test_data = test_datagen.flow_from_directory(
    TEST_DIR,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="categorical",
    shuffle=False
)


# ============================================================
# 6. DISPLAY INFORMATION
# ============================================================

print("\nClass mapping:")
print(train_data.class_indices)

print("\nTraining images:", train_data.samples)
print("Validation images:", validation_data.samples)
print("Testing images:", test_data.samples)


# ============================================================
# 7. DISPLAY SAMPLE IMAGES
# ============================================================

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


# ============================================================
# 8. BUILD CNN MODEL
# ============================================================

model = Sequential([

    Input(shape=(224, 224, 3)),

    # First convolution block
    Conv2D(
        32,
        (3, 3),
        activation="relu"
    ),

    MaxPooling2D(
        pool_size=(2, 2)
    ),


    # Second convolution block
    Conv2D(
        64,
        (3, 3),
        activation="relu"
    ),

    MaxPooling2D(
        pool_size=(2, 2)
    ),


    # Third convolution block
    Conv2D(
        128,
        (3, 3),
        activation="relu"
    ),

    MaxPooling2D(
        pool_size=(2, 2)
    ),


    # Convert feature maps into vector
    Flatten(),


    # Fully connected layer
    Dense(
        128,
        activation="relu"
    ),


    # Reduce overfitting
    Dropout(0.5),


    # Output layer
    Dense(
        4,
        activation="softmax"
    )
])


# ============================================================
# 9. DISPLAY CNN STRUCTURE
# ============================================================

print("\nCNN Model Summary:\n")

model.summary()


# ============================================================
# 10. COMPILE MODEL
# ============================================================

model.compile(
    optimizer="adam",
    loss="categorical_crossentropy",
    metrics=["accuracy"]
)


# ============================================================
# 11. TRAIN CNN
# ============================================================

print("\nStarting CNN training...\n")

history = model.fit(
    train_data,
    validation_data=validation_data,
    epochs=EPOCHS
)


# ============================================================
# 12. TEST CNN
# ============================================================

print("\nEvaluating CNN on test data...\n")

test_loss, test_accuracy = model.evaluate(
    test_data
)


print("\nTest Loss:", test_loss)

print("Test Accuracy:", test_accuracy)


# ============================================================
# 13. MAKE PREDICTIONS
# ============================================================

print("\nMaking predictions...\n")

predictions = model.predict(test_data)

predicted_classes = np.argmax(
    predictions,
    axis=1
)

actual_classes = test_data.classes


# ============================================================
# 14. CLASSIFICATION REPORT
# ============================================================

print("\nClassification Report:\n")

print(
    classification_report(
        actual_classes,
        predicted_classes,
        target_names=classes
    )
)


# ============================================================
# 15. CONFUSION MATRIX
# ============================================================

cm = confusion_matrix(
    actual_classes,
    predicted_classes
)


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


# ============================================================
# 16. TRAINING VS VALIDATION ACCURACY
# ============================================================

plt.figure(figsize=(8, 6))

plt.plot(
    history.history["accuracy"],
    label="Training Accuracy"
)

plt.plot(
    history.history["val_accuracy"],
    label="Validation Accuracy"
)

plt.xlabel("Epoch")

plt.ylabel("Accuracy")

plt.title("Training vs Validation Accuracy")

plt.legend()

plt.tight_layout()

plt.show()


# ============================================================
# 17. TRAINING VS VALIDATION LOSS
# ============================================================

plt.figure(figsize=(8, 6))

plt.plot(
    history.history["loss"],
    label="Training Loss"
)

plt.plot(
    history.history["val_loss"],
    label="Validation Loss"
)

plt.xlabel("Epoch")

plt.ylabel("Loss")

plt.title("Training vs Validation Loss")

plt.legend()

plt.tight_layout()

plt.show()


# ============================================================
# 18. SAVE CNN MODEL
# ============================================================

model.save(
    "brain_tumor_cnn.keras"
)

print("\nCNN model saved successfully!")

print("File: brain_tumor_cnn.keras")