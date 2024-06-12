# %%
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import classification_report,confusion_matrix,accuracy_score,  precision_score, recall_score, f1_score
from sklearn.model_selection import  RandomizedSearchCV, train_test_split , GridSearchCV
from sklearn.feature_selection import SelectKBest, f_classif
from sklearn.ensemble import RandomForestClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import MinMaxScaler
from mlxtend.plotting import plot_confusion_matrix
#%matplotlib inline
#To turn off warning messages.
import warnings
warnings.filterwarnings('ignore')

# %%
# Importing the dataset 
train_data = pd.read_csv("DDetect/Testing.csv")  
train_data.head() 

# %%
train_data = train_data.drop(['Unnamed: 133'],axis=1)

# %%
train_data.shape

# %%
train_data.info()

# %%
train_data.describe().T

# %%
train_data.isnull().sum()

# %%
#make copy to see correlation
copy = train_data.copy()
copy = copy.drop(['prognosis'],axis=1)

# %%
#Colerration check.
plt.style.use('fivethirtyeight')
plt.figure(figsize=(150, 150))
sns.heatmap(copy.corr(),annot=True,fmt = ".2f",cmap='viridis')
plt.show()

# %%
X_train = train_data.drop(["prognosis"], axis = 1)  
y_train = train_data["prognosis"] 

# %%
scale=MinMaxScaler()
scale.fit(X_train)

# %%
test_data = pd.read_csv('DDetect/Training.csv')
test_data.head()

# %%
X_test = test_data.drop(["prognosis"], axis = 1)  
y_test = test_data["prognosis"] 

# %%
scale2=MinMaxScaler()
scale2.fit(X_test)

# %%
clf_knn=KNeighborsClassifier()
parametrs_knn={'n_neighbors':[1,3,5,7,9,11], 'metric':['euclidean','manhattan','chebyshev']}
grid_clf_knn=GridSearchCV(clf_knn, parametrs_knn, cv=6, n_jobs=-1)
grid_clf_knn.fit(X_train, y_train)

# %%
best_model_knn=grid_clf_knn.best_estimator_
y_pred_knn=best_model_knn.predict(X_test)

# %%
cm_knn = confusion_matrix(y_test, y_pred_knn)
print("Confution matrix for model " f'{best_model_knn} : \n',cm_knn)
ac_knn = accuracy_score(y_test, y_pred_knn)
print("Accuracy score for model " f'{best_model_knn} : ',ac_knn)
cr_knn = classification_report(y_test, y_pred_knn)
print("classification_report for model " f'{best_model_knn} : \n',cr_knn)

# %%
cm_rnf = confusion_matrix(y_test, y_pred_knn)
fig, ax = plot_confusion_matrix(conf_mat=cm_rnf ,
                                show_absolute=True,
                                colorbar=True,
                                cmap='Wistia',
                               figsize=(12, 12))
plt.title("CM for Diseases Model")
plt.show()

# %%
print(best_model_knn.score(X_train,y_train))

# %%
print(best_model_knn.score(X_test,y_test))

# %%



