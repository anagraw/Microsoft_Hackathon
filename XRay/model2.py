import torch 
import torch.nn as nn
from torchvision import transforms
from torch.utils.data import DataLoader, Dataset
from torchvision.transforms import ToTensor, Normalize
import pandas as pd
from PIL import Image
import matplotlib.pyplot as plt
import cv2

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# Load the dataset
df = pd.read_csv('xray_chest.csv')
df['jpg'] = 'files' + df['jpg']

num_photos_per_class = 3
grouped_data = df.groupby('type')

# Display sample images
for class_name, group in grouped_data:
    print(f"Class: {class_name}")
    images = group['jpg'].sample(n=num_photos_per_class, replace=True).values
    
    fig, axes = plt.subplots(1, num_photos_per_class, figsize=(12, 4))
    for i, image_path in enumerate(images):
        img = cv2.imread(image_path)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        axes[i].imshow(img)
        axes[i].axis('off')
    
    plt.show()

# Define transformations
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.5], std=[0.5])
])

# Custom Dataset class
class CustomDataset(Dataset):
    def __init__(self, csv_file, transform=None):
        self.data = pd.read_csv(csv_file)
        self.transform = transform
        
    def __len__(self):
        return len(self.data)
    
    def __getitem__(self, idx):
        img_path = "files" + self.data.loc[idx, 'jpg']
        label = self.data.loc[idx, 'type']
        
        image = Image.open(img_path).convert('L')
        
        if self.transform:
            image = self.transform(image)
            
        return image, label

# Create dataset and dataloaders
dataset = CustomDataset(
    csv_file='xray_chest.csv',
    transform=transform
)

train_size = int(0.8 * len(dataset))
test_size = len(dataset) - train_size
train_dataset, test_dataset = torch.utils.data.random_split(dataset, [train_size, test_size])

train_dataloader = DataLoader(train_dataset, batch_size=32, shuffle=True)
test_dataloader = DataLoader(test_dataset, batch_size=32, shuffle=False)

# Define the model
model = nn.Sequential(
    nn.Conv2d(1, 16, kernel_size=3, stride=1, padding=1),
    nn.ReLU(),
    nn.MaxPool2d(kernel_size=2, stride=2),
    nn.Conv2d(16, 32, kernel_size=3, stride=1, padding=1),
    nn.ReLU(),
    nn.MaxPool2d(kernel_size=2, stride=2),
    nn.Flatten(),
    nn.Linear(32 * 56 * 56, 512),
    nn.ReLU(),
    nn.Linear(512, 17)
)

model = model.to(device)

criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=0.001)

class_to_int = {'abscess': 0, 'ards': 1, 'atelectasis': 2, 'atherosclerosis of the aorta': 3,
               'cardiomegaly': 4, 'emphysema': 5, 'fracture': 6, 'hydropneumothorax': 7,
               'hydrothorax': 8, 'pneumonia': 9, 'pneumosclerosis': 10,
               'post-inflammatory changes': 11, 'post-traumatic ribs deformation': 12, 'sarcoidosis': 13,
               'scoliosis': 14, 'tuberculosis': 15, 'venous congestion': 16}

# Training the model
num_epochs = 50
for epoch in range(num_epochs):
    model.train()
    train_loss = 0.0 
    
    for images, labels in train_dataloader:
        images = images.to(device)
        labels = [class_to_int[label] for label in labels]
        labels = torch.tensor(labels).to(device)
        
        optimizer.zero_grad()
        
        outputs = model(images)
        loss = criterion(outputs, labels)
        
        loss.backward()
        optimizer.step()
        
        train_loss += loss.item() * images.size(0)
        
    train_loss = train_loss / len(train_dataset)
    print(f"Epoch {epoch+1}/{num_epochs}: Train Loss = {train_loss:.4f}")

# Save the trained model
torch.save(model.state_dict(), 'model.pth')

# Evaluate the model
model.eval()
test_loss = 0.0  
correct = 0

with torch.no_grad():
    for images, labels in test_dataloader:
        images = images.to(device)
        labels = [class_to_int[label] for label in labels]
        labels = torch.tensor(labels).to(device)
        
        outputs = model(images)
        _, predicted = torch.max(outputs.data, 1)
        
        test_loss += criterion(outputs, labels).item() * images.size(0)
        correct += (predicted == labels).sum().item()
        
test_loss = test_loss / len(test_dataset)
accuracy = correct / len(test_dataset)

print(f"Test Loss = {test_loss:.4f}")
print(f"Accuracy = {accuracy*100:.2f}%")
