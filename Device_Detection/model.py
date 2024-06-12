import joblib
import pandas as pd
from sklearn.model_selection import GridSearchCV
from sklearn.neighbors import KNeighborsClassifier

def train_and_save_model(training_data_path, model_save_path):
    # Importing the dataset 
    train_data = pd.read_csv(training_data_path)
    train_data = train_data.drop(['Unnamed: 133'], axis=1)

    X_train = train_data.drop(["prognosis"], axis=1)
    y_train = train_data["prognosis"]

    clf_knn = KNeighborsClassifier()
    parametrs_knn = {'n_neighbors': [1, 3, 5, 7, 9, 11], 'metric': ['euclidean', 'manhattan', 'chebyshev']}
    grid_clf_knn = GridSearchCV(clf_knn, parametrs_knn, cv=6, n_jobs=-1)
    grid_clf_knn.fit(X_train, y_train)

    best_model_knn = grid_clf_knn.best_estimator_

    # Save the model
    joblib.dump(best_model_knn, model_save_path)
    print(f'Model saved to {model_save_path}')

def load_model(model_path):
    # Load the model
    model = joblib.load(model_path)
    return model
