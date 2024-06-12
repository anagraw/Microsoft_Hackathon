import pandas as pd

# Load the training data
train_data = pd.read_csv('DDetect/Training.csv')

# Exclude the 'prognosis' and 'Unnamed: 133' columns
feature_names = train_data.columns.drop(['prognosis', 'Unnamed: 133'])

# Print the number of features
print(f"Number of features (excluding 'prognosis'): {len(feature_names)}")
print(f"Feature names (excluding 'prognosis'):")
print(feature_names)
