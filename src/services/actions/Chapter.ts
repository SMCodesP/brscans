import { Viewset, endpoints } from '../Viewset';

class Chapter extends Viewset<TChapter> {
  public endpoint: endpoints = 'chapters';
}

export default Chapter;
