from model import train_and_save_model
import pandas as pd

# Paths to the data and where to save the model
training_data_path = 'DDetect/Training.csv'
model_save_path = 'knn_model.pkl'

# Train and save the model
train_and_save_model(training_data_path, model_save_path)
train_data = pd.read_csv('DDetect/Training.csv')
print(f"Number of features (excluding 'prognosis'): {len(train_data.columns) - 1}")

